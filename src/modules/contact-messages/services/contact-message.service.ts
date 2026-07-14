import { AppError } from "@/core/errors/app-error";
import { contactMessageRepository } from "@/repositories/contact-message.repository";
import type {
  CreateContactMessageDto,
  GetContactMessageQueryDto,
} from "../validations/contact-message.validation.js";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class ContactMessageService {
  async submitMessage(data: CreateContactMessageDto) {
    return contactMessageRepository.create(data);
  }

  async getMessages(query: GetContactMessageQueryDto) {
    const { page, limit } = query;
    const { messages, total } = await contactMessageRepository.findAll(query);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return { messages, pagination };
  }

  async getMessageById(id: string) {
    const message = await contactMessageRepository.findById(id);
    if (!message) {
      throw AppError.notFound("Contact message not found.");
    }
    return message;
  }

  async update(id: string, isRead: boolean) {
    const existing = await contactMessageRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Contact message not found.");
    }

    const updated = await contactMessageRepository.update(id, isRead);
    if (!updated) {
      throw AppError.internal("Failed to update message status.");
    }
    return updated;
  }

  async deleteMessage(id: string) {
    const deleted = await contactMessageRepository.delete(id);
    if (!deleted) {
      throw AppError.notFound("Contact message not found.");
    }
    return deleted;
  }

  async getUnreadCount() {
    const count = await contactMessageRepository.countUnread();
    return { count };
  }
}

export const contactMessageService = new ContactMessageService();