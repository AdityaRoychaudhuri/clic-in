"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";
import { success } from "zod";

const CREDIT_VALUE = 10;
const PLATFORM_FEE_PER_CREDIT = 2;
const DOCTOR_EARNING_PER_CREDIT = 8;

export async function getDoctorPayouts(params) {
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
      throw new Error("Doctor not found!");
    }

    const payouts = await db.payout.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        createdAt: "desc"
      },
    });

    return { payouts }
  } catch (error) {
    console.error("Error at getDoctorPayouts server action: "+error.message);
    throw new Error("Cannot fetch doctor payout details");
  }
}

export async function requestPayout(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const doctor = await db.user.findUnique({
      where: {
        clerkId: userId,
        role: "DOCTOR"
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found!");
    }

    const paypalEmail = formData.get("paypalEmail");
    const doctorCredit = doctor.credit;

    const existingPayouts = await db.payout.findFirst({
      where: {
        doctorId: doctor.id,
        status: "PROCESSING"
      },
    });

    if (existingPayouts) {
      throw new Error("Payout processing already in queue!");
    }

    if (doctorCredit===0) {
      throw new Error("Doctor has 0 credits!");
    }

    if (doctorCredit < 1) {
      throw new Error("Doctor has to have atleast 1 credit to cashout!");
    }

    const totalAmount = doctorCredit * CREDIT_VALUE;
    const platformFee = doctorCredit * PLATFORM_FEE_PER_CREDIT;
    const netAmount = doctorCredit * DOCTOR_EARNING_PER_CREDIT;

    const payout = await db.payout.create({
      data: {
        doctorId: doctor.id,
        amount: totalAmount,
        credits: credit,
        platformFee,
        netAmount,
        paypalEmail,
        status: "PROCESSING"
      }
    });

    revalidatePath("/doctor");
    return {
      success: true,
      payout
    }
  } catch (error) {
    console.error("Error at requestPayout server action - payout.js: "+error.message);
    throw new Error("Cannot request payout!");
  }
}

export async function getDoctorEarningDetails(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
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

    const completedAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "COMPLETED"
      },
    });

    const currMonth = new Date();
    currMonth.setDate(1);
    currMonth.setHours(0,0,0,0);

    const thisMonthAppointments = completedAppointments.filter((appointment) => new Date(appointment.createdAt) >= currMonth);

    const totalEarning = doctor.credit * DOCTOR_EARNING_PER_CREDIT;
    const thisMonthEarning = thisMonthAppointments.lenhgth * 2 * DOCTOR_EARNING_PER_CREDIT;
    const averageMonthylyEarning = totalEarning > 0 ? totalEarning / Math.max(1, new Date().getMonth() + 1) : 0;
    
    const availableCredits = doctor.credit;
    const availablePayout = availableCredits * DOCTOR_EARNING_PER_CREDIT;

    return {
      earnings: {
        totalEarning,
        thisMonthEarning,
        averageMonthylyEarning,
        availableCredits,
        availablePayout,
        completedAppointments: completedAppointments.length,
      }
    }
  } catch (error) {
    console.error("Error in getDoctorEarnings server action - payout.js: "+error.message);
    throw new Error("Cannot get doctor earning details");
  }
}