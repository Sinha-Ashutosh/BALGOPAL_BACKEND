import { Request, Response } from "express";

import { asyncHandler } from "@/middlewares/async-handler";
import { response } from "@/utils/response";

import { settingsService } from "../services/settings.service.js";
import type { UpdateWebsiteSettingsDto } from "../validations/settings.validation.js";

const getSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    const settings = await settingsService.getSettings();

    return response.success(
      res,
      { settings },
      "Website settings fetched successfully."
    );
  }
);

const updateSettings = asyncHandler(
  async (
    req: Request<object, object, UpdateWebsiteSettingsDto>,
    res: Response
  ) => {
    const settings = await settingsService.updateSettings(req.body);

    return response.success(
      res,
      { settings },
      "Website settings updated successfully."
    );
  }
);

export const settingsController = {
  getSettings,
  updateSettings,
};