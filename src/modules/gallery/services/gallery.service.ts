import { AppError } from "@/core/errors/app-error";
import { galleryRepository } from "@/repositories/gallery.repository";
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from "@/utils/cloudinary-upload";

import type {
  CreateGalleryDto,
  GetGalleryQueryDto,
  UpdateGalleryDto,
} from "../validations/gallery.validation.js";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class GalleryService {
  async createGalleryItem(
    data: CreateGalleryDto,
    file?: Express.Multer.File
  ) {
    if (!file) {
      throw AppError.badRequest("An image file is required.");
    }

    const { url, publicId } = await uploadBufferToCloudinary(
      file.buffer,
      "gallery"
    );

    try {
      return await galleryRepository.create({
        title: data.title,
        category: data.category,
        imageUrl: url,
        imagePublicId: publicId,
      });
    } catch (error) {
      await deleteFromCloudinary(publicId);
      throw error;
    }
  }

  async getGalleryItems(query: GetGalleryQueryDto) {
    const { page, limit } = query;

    const { gallery, total } = await galleryRepository.findAll(query);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return {
      gallery,
      pagination,
    };
  }

  async updateGalleryItem(
    id: string,
    data: UpdateGalleryDto,
    file?: Express.Multer.File
  ) {
    const existing = await galleryRepository.findById(id);

    if (!existing) {
      throw AppError.notFound("Gallery item not found.");
    }
    
    if (
    !file &&
    data.title === undefined &&
    data.category === undefined
    ) {
    throw AppError.badRequest(
        "At least one field or an image must be provided for update."
    );
    }

    const updateData: Partial<{
      title: string;
      category: string;
      imageUrl: string;
      imagePublicId: string;
    }> = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.category !== undefined) {
      updateData.category = data.category;
    }

    let uploadedImage:
      | {
          url: string;
          publicId: string;
        }
      | undefined;

    try {
      if (file) {
        const uploaded = await uploadBufferToCloudinary(
          file.buffer,
          "gallery"
        );

        updateData.imageUrl = uploaded.url;
        updateData.imagePublicId = uploaded.publicId;

        uploadedImage = uploaded;

      }

      const updated = await galleryRepository.update(id, updateData);

      if (!updated) {
        throw AppError.internal("Failed to update gallery item.");
      }

      if (uploadedImage) {
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

  async deleteGalleryItem(id: string) {
    const item = await galleryRepository.findById(id);

    if (!item) {
      throw AppError.notFound("Gallery item not found.");
    }

    await galleryRepository.delete(id);

    await deleteFromCloudinary(item.imagePublicId);
  }
}

export const galleryService = new GalleryService();