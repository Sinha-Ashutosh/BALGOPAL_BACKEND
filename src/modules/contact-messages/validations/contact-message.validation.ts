import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(255, "Name cannot exceed 255 characters."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address.")
    .max(255, "Email cannot exceed 255 characters."),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number.")
    .optional(),

  subject: z
    .string()
    .trim()
    .min(2, "Subject must be at least 2 characters.")
    .max(255, "Subject cannot exceed 255 characters."),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message cannot exceed 2000 characters."),
});

export type CreateContactMessageDto = z.infer<
  typeof createContactMessageSchema
>;

export const updateContactMessageSchema = z
  .object({
    isRead: z.boolean(),
  })
  .strict();

export type UpdateContactMessageDto = z.infer<
  typeof updateContactMessageSchema
>;

export const getContactMessageSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),

  search: z.string().trim().max(255).optional(),

  isRead: z.coerce.boolean().optional(),

  sortBy: z
    .enum(["name", "createdAt"])
    .default("createdAt"),

  order: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export type GetContactMessageQueryDto = z.infer<
  typeof getContactMessageSchema
>;