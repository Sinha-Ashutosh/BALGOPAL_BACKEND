import { z } from "zod";

const baseTestimonialSchema = z.object({
  parentName: z
    .string()
    .trim()
    .min(2, "Parent name must be at least 2 characters.")
    .max(255, "Parent name cannot exceed 255 characters."),
  studentName: z
    .string()
    .trim()
    .min(2, "Student name must be at least 2 characters.")
    .max(255, "Student name cannot exceed 255 characters."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters."),
  rating: z.coerce.number().int().min(1, "Rating must be at least 1.").max(5, "Rating cannot exceed 5.").default(5),
  isActive: z.coerce.boolean().optional().default(true),
});

export const createTestimonialSchema = baseTestimonialSchema;
export type CreateTestimonialDto = z.infer<typeof createTestimonialSchema>;

export const updateTestimonialSchema = baseTestimonialSchema
  .partial()

export type UpdateTestimonialDto = z.infer<typeof updateTestimonialSchema>;

export const getTestimonialSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(255).optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(["parentName", "rating", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
export type GetTestimonialQueryDto = z.infer<typeof getTestimonialSchema>;