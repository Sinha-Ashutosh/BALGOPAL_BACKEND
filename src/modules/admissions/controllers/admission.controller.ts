import type { Request, Response } from "express";

import { asyncHandler } from "@/middlewares/async-handler";
import { response } from "@/utils/response";

import { admissionService } from "../services/admission.service.js";

import type {
  CreateAdmissionDto,
  GetAdmissionQueryDto,
  UpdateAdmissionDto,
  UpdateAdmissionStatusDto,
} from "../validations/admission.validation.js";

const createAdmission = asyncHandler(
  async (
    req: Request<object, object, CreateAdmissionDto>,
    res: Response
  ) => {
    const admission = await admissionService.createAdmission(req.body);

    return response.success(
      res,
      { admission },
      "Admission submitted successfully.",
      201
    );
  }
);

const getAdmissions = asyncHandler(
  async (
    req: Request<object, object, object, GetAdmissionQueryDto>,
    res: Response
  ) => {
    const result = await admissionService.getAdmissions(req.query);

    return response.success(
      res,
      result,
      "Admissions fetched successfully."
    );
  }
);

const getAdmissionById = asyncHandler(
  async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    const admission = await admissionService.getAdmissionById(
      req.params.id
    );

    return response.success(
      res,
      { admission },
      "Admission fetched successfully."
    );
  }
);

const updateAdmission = asyncHandler(
  async (
    req: Request<{ id: string }, object, UpdateAdmissionDto>,
    res: Response
  ) => {
    const admission =
      await admissionService.updateAdmission(
        req.params.id,
        req.body
      );

    return response.success(
      res,
      { admission },
      "Admission updated successfully."
    );
  }
);

const updateAdmissionStatus = asyncHandler(
  async (
    req: Request<
      { id: string },
      object,
      UpdateAdmissionStatusDto
    >,
    res: Response
  ) => {
    const admission =
      await admissionService.updateAdmissionStatus(
        req.params.id,
        req.body
      );

    return response.success(
      res,
      { admission },
      "Admission status updated successfully."
    );
  }
);

const deleteAdmission = asyncHandler(
  async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    await admissionService.deleteAdmission(req.params.id);

    return response.success(
      res,
      null,
      "Admission deleted successfully."
    );
  }
);

export const admissionController = {
  createAdmission,
  getAdmissions,
  getAdmissionById,
  updateAdmission,
  updateAdmissionStatus,
  deleteAdmission,
};