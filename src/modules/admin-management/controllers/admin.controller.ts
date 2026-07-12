import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler";
import { response } from "@/utils/response";
import { adminService } from "../services/admin.service";
import type { CreateAdminDto, GetAdminsQueryDto, GetAdminByIdDto, UpdateAdminDto } from "../validations/admin.validation";
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

const getAdmins = asyncHandler(
  async (
    req: Request<Record<string, never>, object, object, GetAdminsQueryDto>,
    res: Response
  ) => {
    const result = await adminService.getAdmins(req.query);

    return response.success(
      res,
      result,
      "Admins fetched successfully."
    );
  }
);

const getAdminById = asyncHandler(
  async (
    req: Request<GetAdminByIdDto>,
    res: Response
  ) => {
    const admin = await adminService.getAdminById(req.params.id);

    return response.success(
      res,
      { admin },
      "Admin fetched successfully."
    );
  }
);

const updateAdmin = asyncHandler(
  async (
    req: Request<{ id: string }, object, UpdateAdminDto>,
    res: Response
  ) => {
    const admin = await adminService.updateAdmin(
      req.params.id,
      req.body,
      req.user!
    );

    return response.success(
      res,
      { admin },
      "Admin updated successfully."
    );
  }
);

const deleteAdmin = asyncHandler(
  async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    await adminService.deleteAdmin(
      req.params.id,
      req.user!
    );

    return response.success(
      res,
      null,
      "Admin deleted successfully."
    );
  }
);

export const adminController = {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
};