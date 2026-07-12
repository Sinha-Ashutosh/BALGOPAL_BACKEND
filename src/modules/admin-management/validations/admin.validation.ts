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

export const getAdminsSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, "Page must be at least 1.")
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1.")
    .max(100, "Limit cannot exceed 100.")
    .default(10),

  search: z
    .string()
    .trim()
    .max(100, "Search term cannot exceed 100 characters.")
    .optional(),

  role: z
    .enum(ROLE_VALUES)
    .optional(),

  isActive: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  sortBy: z
    .enum([
      "name",
      "email",
      "createdAt",
      "lastLogin",
    ])
    .default("createdAt"),

  order: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export const getAdminByIdSchema = z.object({
  id: z
    .string()
    .uuid("Invalid admin id."),
});

export const updateAdminSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name cannot exceed 100 characters.")
      .optional(),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address.")
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(
        /^[0-9]{10}$/,
        "Phone number must contain exactly 10 digits."
      )
      .optional(),

    profileImage: z
      .string()
      .trim()
      .url("Profile image must be a valid URL.")
      .nullable()
      .optional(),

    role: z.enum(ROLE_VALUES).optional(),

    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided for update.",
    }
  );

export type UpdateAdminDto = z.infer<typeof updateAdminSchema>;
export type GetAdminsQueryDto = z.infer<typeof getAdminsSchema>;
export type CreateAdminDto = z.infer<typeof createAdminSchema>["body"];
export type GetAdminByIdDto = z.infer<typeof getAdminByIdSchema>;