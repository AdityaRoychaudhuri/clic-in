"user server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { success } from "zod";

export async function setUserRole(formData) {
    // Set eithet patient or doctor. If they are doctor more 
    // info required on speciality coming from forms

    const { userId } = await auth();

    if (!userId) {
        throw new Error("User is not authorized");
    }

    const user = await db.user.findUnique({
        where: {
            clerkId: userId,
        }
    })

    if (!user) {
        throw new Error("User not found!");
    }

    const role = formData.get("role");

    if (!role || !["PATIENT","DOCTOR"].includes(role)) {
        throw new Error("Invalid selection of roles");
    }

    try {
        if (role === "PATIENT") {
            await db.user.update({
                where: {
                    clerkId: userId,
                },
                data: {
                    role: "PATIENT"
                }
            });

            revalidatePath("/");
            return {
                success: true,
                redirect: "/doctors",
            }
        }

        if (role === "DOCTOR") {
            const speciality = formData.get("speciality");
            const experience = parseInt(formData.get("experience"));
            const credentialUrl = formData.get("credentialUrl");
            const description = formData.get("description");

            if (!speciality || !experience || !credentialUrl || !description) {
                throw new Error("All fields are required");
            }

            await db.user.update({
                where: {
                    clerkId: userId
                },
                data: {
                    role: "DOCTOR",
                    speciality,
                    experience,
                    credentialUrl,
                    description,
                    verificationStatus: "PENDING"
                }
            })

            revalidatePath("/");
            return {
                success: true,
                redirect: "/doctor/verification"
            }
        }
    } catch (error) {
        console.error("Failed to set user role", error);
        throw new Error(`Failed to update user profile: ${error.message}`);
    }
}


export async function getUserInfo() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User is not authorized");
    }

    try {
        const user = await db.user.findUnique({
            where: {
                clerkId: userId,
            }
        });

        return user;
    } catch (error) {
        console.error("Failed to get user", error);
        return null;
    }
}