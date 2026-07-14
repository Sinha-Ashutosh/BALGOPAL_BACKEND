import { AppError } from "@/core/errors/app-error";
import { admissionRepository } from "@/repositories/admission.repository";

import type {
  CreateAdmissionDto,
  GetAdmissionQueryDto,
  UpdateAdmissionDto,
  UpdateAdmissionStatusDto,
} from "../validations/admission.validation.js";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class AdmissionService {
  async createAdmission(data: CreateAdmissionDto) {
    const existing = await admissionRepository.findByEmail(data.email);

    if (existing) {
      throw AppError.conflict(
        "An admission request with this email already exists."
      );
    }

    return admissionRepository.create(data);
  }

  async getAdmissions(query: GetAdmissionQueryDto) {
    const { page, limit } = query;

    const { admissions, total } =
      await admissionRepository.findAll(query);

    const totalPages = Math.max(
      Math.ceil(total / limit),
      1
    );

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return {
      admissions,
      pagination,
    };
  }

  async getAdmissionById(id: string) {
    const admission = await admissionRepository.findById(id);

    if (!admission) {
      throw AppError.notFound("Admission not found.");
    }

    return admission;
  }

  async updateAdmission(
    id: string,
    data: UpdateAdmissionDto
  ) {
    const existing =
      await admissionRepository.findById(id);

    if (!existing) {
      throw AppError.notFound("Admission not found.");
    }

    if (Object.keys(data).length === 0) {
      throw AppError.badRequest(
        "At least one field must be provided for update."
      );
    }

    if (
      data.email &&
      data.email !== existing.email
    ) {
      const duplicate =
        await admissionRepository.findByEmail(
          data.email
        );

      if (duplicate && duplicate.id !== id) {
        throw AppError.conflict(
          "An admission request with this email already exists."
        );
      }
    }

    const updated =
      await admissionRepository.update(id, data);

    if (!updated) {
      throw AppError.internal(
        "Failed to update admission."
      );
    }

    return updated;
  }

  async updateAdmissionStatus(
    id: string,
    data: UpdateAdmissionStatusDto
  ) {
    const existing =
      await admissionRepository.findById(id);

    if (!existing) {
      throw AppError.notFound("Admission not found.");
    }

    const updated =
      await admissionRepository.updateStatus(
        id,
        data.status
      );

    if (!updated) {
      throw AppError.internal(
        "Failed to update admission status."
      );
    }

    return updated;
  }

  async deleteAdmission(id: string) {
    const deleted =
      await admissionRepository.delete(id);

    if (!deleted) {
      throw AppError.notFound("Admission not found.");
    }

    return deleted;
  }
}

export const admissionService =
  new AdmissionService();