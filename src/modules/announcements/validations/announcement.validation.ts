import { z } from "zod";

const baseAnnouncementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(255, "Title cannot exceed 255 characters."),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters."),
  isActive: z.boolean().optional().default(true),
  publishAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),
});

function validateDateOrder(data: { publishAt?: Date; expiresAt?: Date }) {
  return !data.publishAt || !data.expiresAt || data.expiresAt >= data.publishAt;
}

export const createAnnouncementSchema = baseAnnouncementSchema.refine(
  validateDateOrder,
  { path: ["expiresAt"], message: "Expiry date must be after publish date." }
);
export type CreateAnnouncementDto = z.infer<typeof createAnnouncementSchema>;

export const updateAnnouncementSchema = baseAnnouncementSchema
  .partial()
  .refine(validateDateOrder, {
    path: ["expiresAt"],
    message: "Expiry date must be after publish date.",
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "At least one field must be provided for update." }
  );
export type UpdateAnnouncementDto = z.infer<typeof updateAnnouncementSchema>;

export const getAnnouncementSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(255).optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  sortBy: z.enum(["title", "createdAt", "publishAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
export type GetAnnouncementQueryDto = z.infer<typeof getAnnouncementSchema>;