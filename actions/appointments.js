"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, endOfDay, format, isBefore } from "date-fns";
import { deductCreditsForAppointments } from "./credits";
import { revalidatePath } from "next/cache";
import { Auth } from '@vonage/auth'
import { Vonage } from "@vonage/server-sdk";

const credentials = new Auth({
  applicationId: process.env.NEXT_PUBLIC_VONAGE_VID_CALL_KEY,
  privateKey: process.env.VONAGE_PRIVATE_KEY
});

const vonage = new Vonage(credentials, {})

export async function getDoctorById(doctorId) {
  try {
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED"
      }
    });

    return {
      doctor
    }
  } catch (error) {
    throw new Error("Cannot fetch doctor details");
  }
}

export async function getAvailableTimeSlots(doctorId) {
  try {
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED"
      }
    });

    if (!doctor) {
      throw new Error("Cannot find doctor details");
    }

    const availability = await db.availability.findFirst({
      where: {
        doctorId: doctor.id,
        status: "AVAILABLE"
      }
    });
    
    const currDate = new Date();
    const nextFourDays = [currDate, addDays(currDate, 1), addDays(currDate, 2), addDays(currDate, 3)];

    const lastDay = endOfDay(nextFourDays[3]);

    const existingAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED",
        startTime: {
          lte: lastDay
        }
      }
    });

    const availableSlotsByDay = {};

    for (day of nextFourDays) {
      const dayString = format(day, "yyyy-MM-dd");

      availableSlotsByDay[dayString] = [];

      const availabilityStart = new Date(availability.startTime);
      const availabilityEnd = new Date(availability.endTime);

      availabilityStart.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
      );

      availabilityEnd.setFullYear(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      );

      let currTime = new Date(availabilityStart);
      let endTime = new Date(availabilityEnd);

      while (isBefore(addMinutes(currTime, 30), endTime) || +addMinutes(currTime, 30) === +endTime) {
        const next = addMinutes(currTime, 30);

        if (isBefore(currTime, now)) {
          currTime = next;
          continue;
        }

        const overlaps = existingAppointments.some((appointment) => {
          const appointmentStart = new Date(appointment.startTime);
          const appointmentEnd = new Date(appointment.endTime);

          return (
            (currTime >= appointmentStart && currTime < appointmentEnd) ||
            (next > appointmentStart && next <= appointmentEnd) ||
            (currTime <= appointmentStart && next >= appointmentEnd)
          );
        });

        if (!overlaps) {
          availableSlotsByDay[dayString].push({
            startTime: currTime.toISOString(),
            endTime: next.toISOString(),
            formatted: `${format(currTime, "h:mm a")} - ${format(next, 'h:mm a')}`,
            day: format(currTime, "EEEE, MMMM d"),
          });
        }

        currTime = next;
      }
    }

    const res = Object.entries(availableSlotsByDay).map(([date, slots]) => ({
      date,
      displayDate: 
        slots.length > 0 ? slots[0].day : format(new Date(date),"EEEE, MMMM d"),
      slots
    }));

    return {
      days: res
    }
  } catch (error) {
    throw new Error("Failed to fetch available time slots: " + error.message);
  }
}

export async function bookAppointment(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const patient = await db.user.findUnique({
      where: {
        clerkId: userId,
        role: "PATIENT",
      }
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const docId = formData.get("docId");
    const patientDesc = formData.get("patientDesc");

    if (!startTime || !endTime || !docId) {
      throw new Error("Start time, end time and doctor id are required");
    }

    const doctor = await db.user.findUnique({
      where: {
        userId: docId,
        role: "DOCTOR",
        status: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or not verified");
    }

    if (patient.credits < 2) {
      throw new Error("Insufficient credits to book an appointment");
    }

    const overLappingAppointments = await db.appointment.findUnique({
      where: {
        doctorId: docId,
        status: "SCHEDULED",
        OR: [
          {
            startTime: {
              lte: startTime
            },
            endTime: {
              gt: startTime
            },
          },
          {
            startTime: {
              lt: endTime
            },
            endTime: {
              gte: endTime
            },
          },
          {
            startTime: {
              gte: startTime
            },
            endTime: {
              lte: endTime
            },
          },
        ]
      },
    });

    if (overLappingAppointments) {
      throw new Error("Slot is already booked");
    }

    const videoSessionId = await createVideoSession();

    const result = await db.$transaction(async(tx) => {
      const { success, error } = await deductCreditsForAppointments(
        patient.id,
        doctor.id
      );

      if (!success || error) {
        throw new Error(error || "Failed to deduct credits");
      }

      const appointment = await tx.appointment.creat({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          startTime,
          endTime,
          status: "SCHEDULED",
          patientDescription: patientDesc,
          videoSessionId,
        },
      });

      return { appointment };
    });

    revalidatePath("/appointments");

    return {
      appointment: result.appointment,
      success: true
    }
  } catch (error) {
    throw new Error("Failed to book appointment");
  }
}

async function createVideoSession() {
  try {
    const session = await vonage.video.createSession({
      mediaMode: "routed"
    });

    return session.sessionId;
  } catch (error) {
    throw new Error("Unable to create video session id: "+error.message);
    
  }
}