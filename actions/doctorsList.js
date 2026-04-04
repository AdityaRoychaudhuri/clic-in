import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"


export async function getDoctorsBySpeciality(speciality) {
  try {
    const doctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        speciality: speciality,
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