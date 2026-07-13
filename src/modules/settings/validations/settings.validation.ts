import { z } from "zod";

export const updateWebsiteSettingsSchema = z
  .object({
    schoolName: z
      .string()
      .trim()
      .min(2, "School name must be at least 2 characters.")
      .max(150, "School name cannot exceed 150 characters.")
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(
        /^[0-9+\-\s()]{7,20}$/,
        "Invalid phone number."
      )
      .optional(),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Invalid email address."))
      .optional(),

    address: z
      .string()
      .trim()
      .min(5, "Address must be at least 5 characters.")
      .optional(),

    about: z
      .string()
      .trim()
      .min(10, "About section must be at least 10 characters.")
      .optional(),

    heroTitle: z
      .string()
      .trim()
      .min(2, "Hero title must be at least 2 characters.")
      .max(255, "Hero title cannot exceed 255 characters.")
      .optional(),

    heroSubtitle: z
      .string()
      .trim()
      .min(2, "Hero subtitle must be at least 2 characters.")
      .optional(),

    schoolTimings: z
      .string()
      .trim()
      .max(255, "School timings cannot exceed 255 characters.")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided for update.",
    }
  );

export type UpdateWebsiteSettingsDto = z.infer<
  typeof updateWebsiteSettingsSchema
>;