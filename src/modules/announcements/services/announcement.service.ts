import { AppError } from "@/core/errors/app-error.js";
import { announcementRepository } from "@/repositories/announcement.repository.js";
import type {
  CreateAnnouncementDto,
  GetAnnouncementQueryDto,
  UpdateAnnouncementDto,
} from "../validations/announcement.validation.js";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class AnnouncementService {
  async createAnnouncement(data: CreateAnnouncementDto) {
    return announcementRepository.create(data);
  }

  async getAnnouncements(query: GetAnnouncementQueryDto) {
    const { page, limit } = query;
    const { announcements, total } = await announcementRepository.findAll(query);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return { announcements, pagination };
  }

  async updateAnnouncement(id: string, data: UpdateAnnouncementDto) {
    const existing = await announcementRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Announcement not found.");
    }

    if (Object.keys(data).length === 0) {
  throw AppError.badRequest(
    "At least one field must be provided for update."
  );
}
    // Re-validate the date order against the MERGED (existing + incoming)
    // state, since the schema's refine only sees the partial payload.
    const publishAt = data.publishAt ?? existing.publishAt ?? undefined;
    const expiresAt = data.expiresAt ?? existing.expiresAt ?? undefined;

    if (publishAt && expiresAt && expiresAt < publishAt) {
      throw AppError.badRequest("Expiry date must be after publish date.");
    }

    const updated = await announcementRepository.update(id, data);
    if (!updated) {
      throw AppError.internal("Failed to update announcement.");
    }

    return updated;
  }

  async getPublicAnnouncements() {
  return announcementRepository.findPublicActive();
}

  async deleteAnnouncement(id: string) {
    const deleted = await announcementRepository.delete(id);
    if (!deleted) {
      throw AppError.notFound("Announcement not found.");
    }
    return deleted;
  }
}

export const announcementService = new AnnouncementService();