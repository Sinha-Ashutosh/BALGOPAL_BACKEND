import { z } from "zod";
import { ADMISSION_STATUS_VALUES } from "@/constants/admission";

export const createAdmissionSchema = z.object({
  parentName: z
    .string()
    .trim()
    .min(2, "Parent name must be at least 2 characters.")
    .max(255, "Parent name cannot exceed 255 characters."),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number looks too short.")
    .max(20, "Phone number cannot exceed 20 characters."),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(255, "Email cannot exceed 255 characters."),

  childName: z
    .string()
    .trim()
    .min(2, "Child name must be at least 2 characters.")
    .max(255, "Child name cannot exceed 255 characters."),

  childAge: z
    .string()
    .trim()
    .min(1, "Child age is required.")
    .max(20, "Child age cannot exceed 20 characters."),

  message: z
    .string()
    .trim()
    .max(2000, "Message cannot exceed 2000 characters.")
    .optional(),
});

export type CreateAdmissionDto = z.infer<typeof createAdmissionSchema>;

export const updateAdmissionSchema = createAdmissionSchema.partial();

export type UpdateAdmissionDto = z.infer<typeof updateAdmissionSchema>;

export const updateAdmissionStatusSchema = z.object({
  status: z.enum(
    ADMISSION_STATUS_VALUES as [
      (typeof ADMISSION_STATUS_VALUES)[number],
      ...(typeof ADMISSION_STATUS_VALUES)[number][]
    ]
  ),
});

export type UpdateAdmissionStatusDto = z.infer<
  typeof updateAdmissionStatusSchema
>;

export const admissionIdSchema = z.object({
  id: z.string().uuid("Invalid admission ID."),
});

export const getAdmissionSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),

  search: z.string().trim().max(255).optional(),

  status: z
    .enum(
      ADMISSION_STATUS_VALUES as [
        (typeof ADMISSION_STATUS_VALUES)[number],
        ...(typeof ADMISSION_STATUS_VALUES)[number][]
      ]
    )
    .optional(),

  sortBy: z
    .enum([
      "parentName",
      "childName",
      "status",
      "createdAt",
    ])
    .default("createdAt"),

  order: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export type GetAdmissionQueryDto = z.infer<typeof getAdmissionSchema>;