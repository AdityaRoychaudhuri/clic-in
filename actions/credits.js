"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { format } from 'date-fns'
import { revalidatePath } from "next/cache";
import { success } from "zod";

const PLAN_CREDITS = {
    free_user: 0,
    standard_user: 10,
    premium_user: 24
}

const APPOINTMENT_CREDIT_COST = 2;


export async function checkCredits(user) {
	try {
		if (!user) {
			return null;
		}

		if (user.role !== "PATIENT") {
			return user;
		}

		const { has } = await auth();

		const hasBasic = has({ plan: "free_user" });
		const hasStandard = has({ plan: "standard" });
		const hasPremium = has({ plan: "premium" });

		let currPlan = null;
		let allocatedCredits = 0;

		if (hasPremium) {
			currPlan = "premium";
			allocatedCredits = PLAN_CREDITS.premium_user;
		} else if (hasStandard) {
			currPlan = "standard";
			allocatedCredits = PLAN_CREDITS.standard_user;
		} else if (hasBasic) {
			currPlan = "free_user";
			allocatedCredits = PLAN_CREDITS.free_user;
		}

		if (!currPlan) {
			return user;
		}

		const currentMonth = format(new Date(), "yyyy-MM");

		if (user.credits.length > 0) {
			const latestTransaction = user.credits[0];
			const transactionMonth = format(new Date(latestTransaction.createdAt), "yyyy-MM");
			const transactionPlan = latestTransaction.packageId;
			if (transactionMonth === currentMonth && transactionPlan === currPlan) {
					return user;
			}
		}

		const updatedUser = await db.$transaction(async(tx) => {
			await tx.creditTransaction.create({
				data: {
					userId: user.id,
					amount: allocatedCredits,
					type: "CREDIT_PURCHASE",
					packageId: currPlan
				}
			});

			const updateUser = await tx.user.update({
				where: {
						id: user.id,
				},
				data: {
						credit: {
								increment: allocatedCredits,
						}
				}
			});

			return updateUser;
		});

		revalidatePath('/doctors');
		revalidatePath('/appointments');

		return updatedUser;
	} catch (error) {
		console.error("Failed to check subscription and update  credits", error.message);
		return null;
	}
}

export async function deductCreditsForAppointments(patientId, doctorId) {
	try {
		const patient = await db.user.findUnique({
			where: {
				id: patientId,
			},
		});

		const doctor = await db.user.findUnique({
			where: {
				id: doctorId,
			}
		});

		if (patient.credit < APPOINTMENT_CREDIT_COST) {
			throw new Error("Insufficient credits to book an appointment");
		}

		if (!doctor) {
			throw new Error("Doctor not found");
		}

		const res = db.$transaction(async(tx) => {
			await tx.creditTransaction.create({
				data: {
					userId: patient.id,
					amount: -APPOINTMENT_CREDIT_COST,
					type: "APPOINTMENT_DEDUCTION",
				}
			});

			await tx.creditTransaction.create({
				data: {
					userId: doctor.id,
					amount: APPOINTMENT_CREDIT_COST,
					type: "APPOINTMENT_DEDUCTION"
				}
			});

			const updatedPatient = await tx.user.update({
				where: {
					id: patient.id,
				},
				data: {
					credit: {
						decrement: APPOINTMENT_CREDIT_COST
					},
				},
			});

			const updatedDoctor = await tx.user.update({
				where: {
					id: doctor.id,
				},
				data: {
					crdit: {
						increment: APPOINTMENT_CREDIT_COST
					}
				}
			});

			return updatedPatient;
		});

		return {
			success: true,
			user: res
		}
	} catch (error) {
		return {
			success: false,
			error: error.message
		}
	}
}