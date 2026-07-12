import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler";
import { response } from "@/utils/response";
import { adminService } from "../services/admin.service";
import type { CreateAdminDto } from "../validations/admin.validation";
const createAdmin = asyncHandler(
  async (
    req: Request<Record<string, never>, object, CreateAdminDto>,
    res: Response
  ) => {
    const admin = await adminService.createAdmin(req.body, req.user);
    return response.success(
      res,
      { admin },
      "Admin created successfully.",
      201
    );
  }
);
export const adminController = {
  createAdmin,
};