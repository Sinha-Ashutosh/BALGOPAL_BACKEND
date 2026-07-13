import { z } from "zod";

export const createGallerySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(255, "Title cannot exceed 255 characters."),
  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters.")
    .max(100, "Category cannot exceed 100 characters."),
});
export type CreateGalleryDto = z.infer<typeof createGallerySchema>;

export const updateGallerySchema = createGallerySchema
  .partial()
  
export type UpdateGalleryDto = z.infer<typeof updateGallerySchema>;

export const getGallerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  category: z.string().trim().max(100).optional(),
  search: z.string().trim().max(255).optional(),
  sortBy: z.enum(["title", "category", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
export type GetGalleryQueryDto = z.infer<typeof getGallerySchema>;