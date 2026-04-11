"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";
import { id } from "zod/locales";


// for setting and getting availability slots

export async function setDoctorAvailability(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkId: userId,
        role: "DOCTOR"
      }
    });

    if (!doctor) {
      throw new Error("User not found");
    }

    const start = formData.get("startTime");
    const end = formData.get("endTime");

    const startTime = new Date(start);
    const endTime = new Date(end);

    if (!startTime || !endTime) {
      throw new Error("Start and end time both are required");
    }

    if (start >= end) {
      throw new Error("Start should always be less than end time");
    }

    const slots = await db.availability.findMany({
      where: {
        doctorId: doctor.id
      }
    })

    if (slots.length > 0) {
      const unavailableSlots = slots.filter((slot) => !slot.appointment);

      if (unavailableSlots.length > 0) {
        await db.availability.deleteMany({
          where: {
            id: {
              in: unavailableSlots.map((slot) => slot.id)
            }
          }
        })
      }
    }

    const newSlot = await db.availability.create({
      data: {
        doctorId: doctor.id,
        startTime: startTime,
        endTime: endTime,
        status: "AVAILABLE"
      }
    });

    revalidatePath('/doctor');
    return {
      success: true,
      slot: newSlot
    }
  } catch (error) {
    throw new Error("Failed to set availability: "+error.message);
  }
}

export async function getDoctorAvailability() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkId: userId,
        role: "DOCTOR"
      }
    });

    if (!doctor) {
      throw new Error("User not found");
    }

    const availability = await db.availability.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        startTime: "desc"
      },
    });

    return {
      slots: availability
    }
  } catch (error) {
    throw new Error("Failed to fetch availability slots:"+error.message);
  }
}

export async function getDoctorAppointments() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorised");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkId: userId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED"
      }
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const appointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: {
          in: ["SCHEDULED"]
        },
      },
      include: {
        patient: true
      },
      orderBy: {
        startTime: "asc"
      },
    });

    return {
      appointments
    }
  } catch (error) {
    console.log("Error in getDoctorAppointments: "+error.message);
    throw new Error("Failed to fetch doctor appointments");
  }
}

export async function cancelAppointment(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthotized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkId: userId
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId
      },
      include: {
        patient: true,
        doctor: true
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.doctorId !== user.id || appointment.patientId !== user.id) {
      throw new Error("You are not authorized to cancel the appointment");
    }

    const res = await db.$transactions(async(tx) => {
      await tx.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status: "CANCELLED",
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: appointment.patientId,
          amount: 2,
          type: "APPOINTMENT_DEDUCTION",
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: appointment.doctorId,
          amount: -2,
          type: "APPOINTMENT_DEDUCTION",
        },
      });

      await tx.user.update({
        where: {
          id: appointment.patientId
        },
        data: {
          credit: {
            increment: 2,
          },
        },
      });

      await tx.user.update({
        where: {
          id: appointment.doctorId,
        },
        data: {
          credit: {
            decrement: 2,
          },
        },
      });      
    });

    if (user.role === "DOCTOR") {
      revalidatePath("/doctor");
    } else if (user.role === "PATIENT") {
      revalidatePath("/appointments");
    }

    return { success: true}

  } catch (error) {
    console.error("Error in cancelAppointment server action: "+error.message);
    throw new Error("Cannot cancel appointment");
  }
}

export async function getDoctorNotes(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthotized");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkId: userId,
        role: "DOCTOR",
      },
    });
  
    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const appointmentId = formData.get("appointmentId");
    const notes = formData.get("notes");

    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
        doctorId: doctor.id
      },
    });

    if (!appointment) {
      throw new Error("Appintment not found");
    }

    const updatedNotes = await db.appointment.update({
      where: {
        id: appointmentId
      },
      data: {
        notes: notes
      },
    });

    revalidatePath("/doctor");

    return {
      success: true,
      appointment: updatedNotes
    }
  } catch (error) {
    console.error("Error in getDoctorNotes server action: "+error.message);
    throw new Error("Failed to update doctor notes");
  }
}

export async function markAppointmentCompleted(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthotized");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkId: userId,
        role: "DOCTOR",
      },
    });
  
    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const appointmentId = formData.get("appointmentId");

    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
        doctorId: doctor.id
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (!appointment.status !== "SCHEDULED") {
      throw new Error("Only scheduled appointments can be marked as completed");
    }

    const now = new Date();
    const endTime = new Date(appointment.endTime);

    if (now < endTime) {
      throw new Error("Cannot mark appointment as completed before the scheduled end time");
    }

    const updatedAppointment = await db.appointment.update({
      where: {
        id: appointment.id,
      },
      data: {
        status: "COMPLETED"
      },
    });

    revalidatePath("/doctor");
    return {
      success: true,
      appointment: updatedAppointment
    }
  } catch(error) {
    console.error("Error in markAppointmentCompleted: "+error.message);
    throw new Error("Cannot mark appointment as completed");
  }
}