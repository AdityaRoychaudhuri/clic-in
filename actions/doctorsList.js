"use server"

import { db } from "@/lib/prisma"


export async function getDoctorsBySpeciality(speciality) {
  try {
    const doctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        speciality: speciality.split("%20").join(" "),
        verificationStatus: "VERIFIED"
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return { doctors };
  } catch (error) {
    console.error("Cannot fetch doctors ", error.message);
    throw new Error(`Error fetching ${speciality} doctors`);
  }
}