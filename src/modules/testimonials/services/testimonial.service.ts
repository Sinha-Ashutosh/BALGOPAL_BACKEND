import { AppError } from "@/core/errors/app-error";
import { logger } from "@/config";
import { testimonialRepository } from "@/repositories/testimonial.repository";
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from "@/utils/cloudinary-upload";
import type {
  CreateTestimonialDto,
  GetTestimonialQueryDto,
  UpdateTestimonialDto,
} from "../validations/testimonial.validation";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class TestimonialService {
  async createTestimonial(data: CreateTestimonialDto, file?: Express.Multer.File) {
    if (!file) {
      return testimonialRepository.create(data);
    }

    const { url, publicId } = await uploadBufferToCloudinary(file.buffer, "testimonials");

    try {
      return await testimonialRepository.create({
        ...data,
        imageUrl: url,
        imagePublicId: publicId,
      });
    } catch (error) {
      await deleteFromCloudinary(publicId);
      throw error;
    }
  }

  async getTestimonials(query: GetTestimonialQueryDto) {
    const { page, limit } = query;
    const { testimonials, total } = await testimonialRepository.findAll(query);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return { testimonials, pagination };
  }

  async getPublicTestimonials() {
    return testimonialRepository.findPublicActive();
  }

  async updateTestimonial(id: string, data: UpdateTestimonialDto, file?: Express.Multer.File) {
    const existing = await testimonialRepository.findById(id);

    if (
    Object.keys(data).length === 0 &&
    !file
    ) {
    throw AppError.badRequest(
        "At least one field or an image must be provided for update."
    );
    }

    if (!existing) {
      throw AppError.notFound("Testimonial not found.");
    }

    let uploadedImage: { url: string; publicId: string } | undefined;

    try {
      const updateData: Partial<
        UpdateTestimonialDto & { imageUrl: string ; imagePublicId: string  }
      > = { ...data };

      if (file) {
        const uploaded = await uploadBufferToCloudinary(
            file.buffer,
            "testimonials"
        );

        uploadedImage = uploaded;

        updateData.imageUrl = uploaded.url;
        updateData.imagePublicId = uploaded.publicId;
        }

      const updated = await testimonialRepository.update(id, updateData);
      if (!updated) {
        throw AppError.internal("Failed to update testimonial.");
      }

      if (uploadedImage && existing.imagePublicId) {
        await deleteFromCloudinary(existing.imagePublicId);
      }

      return updated;
    } catch (error) {
      if (uploadedImage) {
        await deleteFromCloudinary(uploadedImage.publicId);
      }
      throw error;
    }
  }

  async deleteTestimonial(id: string) {
    const testimonial = await testimonialRepository.delete(id);
    if (!testimonial) {
      throw AppError.notFound("Testimonial not found.");
    }

    if (testimonial.imagePublicId) {
      try {
        await deleteFromCloudinary(testimonial.imagePublicId);
      } catch (err) {
        logger.error(
          { err, publicId: testimonial.imagePublicId },
          "Failed to delete Cloudinary image after testimonial removal."
        );
      }
    }

    return testimonial;
  }
}

export const testimonialService = new TestimonialService();