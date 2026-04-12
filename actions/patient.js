"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"

export async function getPatientAppointments(params) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const patient = await db.user.findUnique({
      where: {
        clerkId: userId,
        role: "PATIENT"
      },
      select: {
        id: true
      }
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    const patientAppointments = await db.appointment.findMany({
      where: {
        patientId: patient.id
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            speciality: true,
            imageUrl: true
          },
        },
      },
      orderBy: {
        startTime: "desc"
      },
    });

    return {
      success: true,
      patientAppointments
    }
  } catch (error) {
    console.log("Error in getPatientAppointment server action: "+error.message);
    throw new Error("Cannot fetch patient appointments");
  }
}