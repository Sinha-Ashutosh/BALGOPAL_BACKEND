import type { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler";
import { response } from "@/utils/response";
import { contactMessageService } from "../services/contact-message.service";
import type {
  CreateContactMessageDto,
  UpdateContactMessageDto,
  GetContactMessageQueryDto,
} from "../validations/contact-message.validation";

const submitMessage = asyncHandler(
  async (req: Request<object, object, CreateContactMessageDto>, res: Response) => {
    const message = await contactMessageService.submitMessage(req.body);
    return response.success(
      res,
      { message },
      "Thank you for reaching out. We'll get back to you soon.",
      201
    );
  }
);

const getMessages = asyncHandler(
  async (
    req: Request<object, object, object, GetContactMessageQueryDto>,
    res: Response
  ) => {
    const result = await contactMessageService.getMessages(req.query);
    return response.success(res, result, "Messages fetched successfully.");
  }
);

const getMessageById = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const message = await contactMessageService.getMessageById(req.params.id);
    return response.success(res, { message }, "Message fetched successfully.");
  }
);

const markAsRead = asyncHandler(
  async (req: Request<{ id: string }, object, UpdateContactMessageDto>, res: Response) => {
    const message = await contactMessageService.update(req.params.id, req.body.isRead);
    return response.success(res, { message }, "Message status updated successfully.");
  }
);

const deleteMessage = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    await contactMessageService.deleteMessage(req.params.id);
    return response.success(res, null, "Message deleted successfully.");
  }
);

const getUnreadCount = asyncHandler(async (_req: Request, res: Response) => {
  const result = await contactMessageService.getUnreadCount();
  return response.success(res, result, "Unread count fetched successfully.");
});

export const contactMessageController = {
  submitMessage,
  getMessages,
  getMessageById,
  markAsRead,
  deleteMessage,
  getUnreadCount,
};