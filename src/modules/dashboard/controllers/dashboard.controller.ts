import type { Request, Response } from "express";

import { asyncHandler } from "@/middlewares/async-handler";
import { response } from "@/utils/response";

import { dashboardService } from "../services/dashboard.service";

const getStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await dashboardService.getStats();

    return response.success(
      res,
      stats,
      "Dashboard stats fetched successfully."
    );
  }
);

const getRecentAdmissions = asyncHandler(
  async (_req: Request, res: Response) => {
    const admissions = await dashboardService.getRecentAdmissions();

    return response.success(
      res,
      admissions,
      "Recent admissions fetched successfully."
    );
  }
);

export const dashboardController = {
  getStats,
  getRecentAdmissions,
};