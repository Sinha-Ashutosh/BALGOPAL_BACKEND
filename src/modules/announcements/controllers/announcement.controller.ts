import type { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler.js";
import { response } from "@/utils/response.js";
import { announcementService } from "../services/announcement.service.js";
import type {
  CreateAnnouncementDto,
  GetAnnouncementQueryDto,
  UpdateAnnouncementDto,
} from "../validations/announcement.validation.js";

const createAnnouncement = asyncHandler(
  async (
    req: Request<object, object, CreateAnnouncementDto>,
    res: Response
  ) => {
    const announcement = await announcementService.createAnnouncement(req.body);
    return response.success(
      res,
      { announcement },
      "Announcement created successfully.",
      201
    );
  }
);

const getAnnouncements = asyncHandler(
  async (
    req: Request<object, object, object, GetAnnouncementQueryDto>,
    res: Response
  ) => {
    const result = await announcementService.getAnnouncements(req.query);
    return response.success(res, result, "Announcements fetched successfully.");
  }
);

const updateAnnouncement = asyncHandler(
  async (
    req: Request<{ id: string }, object, UpdateAnnouncementDto>,
    res: Response
  ) => {
    const announcement = await announcementService.updateAnnouncement(
      req.params.id,
      req.body
    );
    return response.success(res, { announcement }, "Announcement updated successfully.");
  }
);

const deleteAnnouncement = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    await announcementService.deleteAnnouncement(req.params.id);
    return response.success(res, null, "Announcement deleted successfully.");
  }
);

const getPublicAnnouncements = asyncHandler(
  async (_req: Request, res: Response) => {
    const announcements = await announcementService.getPublicAnnouncements();
    return response.success(
      res,
      { announcements },
      "Announcements fetched successfully."
    );
  }
);

export const announcementController = {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  getPublicAnnouncements
};