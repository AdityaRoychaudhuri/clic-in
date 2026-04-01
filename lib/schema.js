import z from "zod";

export const doctorFormSchema = z.object({
    specaility: z.string().min(1, "Speciality is required"),
    experience: z.number({ invalid_type_error: "Experience must be a number" })
                .int()
                .min(2, "Experience must be of atleast 2 year")
                .max(70, "Experience must be less than 3 years"),
    credentialUrl: z.string()
                    .url("Please enter a valid url")
                    .min(1, "Credential url is required"),
    description: z.string()
                .min(20, "Description must be of atleast 20 characters")
                .max(500, "Description cannot be more than 500 characters")
})