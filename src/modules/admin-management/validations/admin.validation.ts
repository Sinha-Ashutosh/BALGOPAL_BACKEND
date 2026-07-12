import { z } from "zod";

import { ROLE_VALUES } from "@/constants/role";

export const createAdminSchema = z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name cannot exceed 100 characters."),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Invalid email address.")),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password cannot exceed 128 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number."
      ),

    phone: z
      .string()
      .trim()
      .regex(
        /^[0-9]{10}$/,
        "Phone number must contain exactly 10 digits."
      )
      .optional(),

    role: z.enum(ROLE_VALUES),

    profileImage: z
      .string()
      .trim()
      .pipe(z.url("Profile image must be a valid URL."))
      .nullable()
      .optional(),
  });

export type CreateAdminDto = z.infer<typeof createAdminSchema>["body"];