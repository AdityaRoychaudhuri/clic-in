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

export async function getDoctorAvailability(params) {
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
  return [];
}