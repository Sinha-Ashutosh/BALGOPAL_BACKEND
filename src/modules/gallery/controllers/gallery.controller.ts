import type { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/async-handler";
import { response } from "@/utils/response";
import { galleryService } from "../services/gallery.service";
import type {
  CreateGalleryDto,
  GetGalleryQueryDto,
  UpdateGalleryDto,
} from "../validations/gallery.validation.js";
const createGalleryItem = asyncHandler(
  async (
    req: Request<object, object, CreateGalleryDto>,
    res: Response
  ) => {
    const gallery = await galleryService.createGalleryItem(
      req.body,
      req.file
    );
    return response.success(
      res,
      { gallery },
      "Gallery item created successfully.",
      201
    );
  }
);
const getGalleryItems = asyncHandler(
  async (
    req: Request<object, object, object, GetGalleryQueryDto>,
    res: Response
  ) => {
    const result = await galleryService.getGalleryItems(req.query);
    return response.success(
      res,
      result,
      "Gallery items fetched successfully."
    );
  }
);
const updateGalleryItem = asyncHandler(
  async (
    req: Request<{ id: string }, object, UpdateGalleryDto>,
    res: Response
  ) => {
    const gallery = await galleryService.updateGalleryItem(
      req.params.id,
      req.body,
      req.file
    );
    return response.success(
      res,
      { gallery },
      "Gallery item updated successfully."
    );
  }
);
const deleteGalleryItem = asyncHandler(
  async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    await galleryService.deleteGalleryItem(req.params.id);
    return response.success(
      res,
      null,
      "Gallery item deleted successfully."
    );
  }
);
export const galleryController = {
  createGalleryItem,
  getGalleryItems,
  updateGalleryItem,
  deleteGalleryItem,
};