"use server"

import { db } from "@/lib/prisma";
import { VerificationStatus } from "@/prisma/generated/enums";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function verifyAdmin() {
  const { userId } = await auth();

  if (!userId) {
    console.error("User is not authenticated");
    return false;
  }

  try {
    const user = await db.user.findUnique({
        where: {
            clerkId: userId
        }
    })

    return user?.role === "ADMIN";
  } catch (error) {
    console.error("User not registered as admin!", error.message);
    return false;
  }
}

export async function getAllPendingDoctors() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    throw new Error("Unauthorised");
  }

  try {
    const pendingDoctors = await db.user.findMany({
        where: {
            role: "DOCTOR",
            verificationStatus: VerificationStatus.PENDING
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return {
        doctors: pendingDoctors
    }
  } catch (error) {
    console.error("Cannot perform this server action: ", error.message);
    throw new Error("Cannot get pending doctor list");
  }
}

export async function getAllVerifiedDoctors() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    throw new Error("Unauthorised");
  }

  try {
    const pendingDoctors = await db.user.findMany({
        where: {
            role: "DOCTOR",
            verificationStatus: VerificationStatus.VERIFIED
        },
        orderBy: {
            createdAt: "asc"
        }
    })

    return {
        doctors: pendingDoctors
    }
  } catch (error) {
    console.error("Cannot perform this server action: ", error.message);
    throw new Error("Cannot get verified doctor list");
  }
}

export async function verifyDoctorStatus(formData) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    throw new Error("Unauthorised");
  }

  const doctorId = formData.get("doctorId");
  const status = formData.get("status");

  if (!formData || !["VERIFIED", "REJECTED"].includes(status)) {
    throw new Error("Invalid input");
  }

  try {
    await db.user.update({
        where: {
            id: doctorId
        },
        data: {
            verificationStatus: status
        }
    });

    revalidatePath("/admin");
    return {
        success: true
    }
  } catch (error) {
    console.error("Cannot perform this server action: ", error.message);
    throw new Error("Cannot updated doctor status to database");
  }
}

export async function updateDoctorStatus(formData) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    throw new Error("Unauthorised");
  }

  const doctorId = formData.get("doctorId");
  const isSuspend = formData.get("status") === "suspend";

  try {
    const status = isSuspend ? "PENDING" : "VERIFIED";

    await db.user.update({
        where: {
            id: doctorId,
        },
        data: {
            verificationStatus: status
        }
    });

    revalidatePath("/admin");
    return {
        success: true
    }
  } catch (error) {
      console.error("Cannot perform this server action: ", error.message);
      throw new Error("Cannot updated doctor status to database");
  }
}

export async function getPendingPayouts(formData) {
  const { isAdmin } = await verifyAdmin();

  if (!isAdmin) {
    throw new Error("Unauthorized as admin");
  }

  try {
    const pendingPayouts = await db.payout.findMany({
      where: {
        status: "PROCESSING",
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            speciality: true,
            credit: true
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { pendingPayouts }
  } catch (error) {
    console.error("Error at pendingPayouts server action - admin.js"+error.message);
    throw new Error("Cannot get pending doctor payout");
  }
}

export async function approvePayout(formData) {
  const { isAdmin } = await verifyAdmin();

  if (!isAdmin) {
    throw new Error("Unauthorized as admin");
  }

  try {
    const { userId } = await auth();

    const admin = await db.user.findUnique({
      where: { 
        clerkUserId: userId 
      },
    });

    const payoutId = formData.get("payoutId");

    const payout = await db.payout.findUnique({
      where: {
        id: payoutId,
        status: "PROCESSING",
      },
      include: {
        doctor: true,
      },
    });

    if (!payout) {
      throw new Error("Payout request not found or already processed");
    }

    if (payout.doctor.credit < payout.credit) {
      throw new Error("Doctor doesn't have enough credits for this payout");
    }

    // transactions

    await db.$transaction(async (tx) => {
      // payout table update
      await tx.payout.update({
        where: {
          id: payoutId
        },
        data: {
          status: "PROCESSED",
          processedAt: new Date(),
          processedBy: admin?.id || "unknown"
        },
      });
      
      await tx.user.update({
        where: {
          id: payout.doctorId
        },
        data: {
          credit: {
            decrement: payout.credit,
          },
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: payout.doctorId,
          amount: -payout.credit,
          type: "ADMIN_ADJUSTMENT"
        },
      });
    });

    revalidatePath("/admin");
    return {
      success: true
    }
  } catch (error) {
    console.error("Error at approvePayout server action - admin.js: "+error.message);
    throw new Error("Unable to approve payout");
  }
}