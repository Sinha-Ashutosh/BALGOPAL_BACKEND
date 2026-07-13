import { Router } from "express";
import { galleryController } from "../controllers/gallery.controller.js";
import {
  createGallerySchema,
  updateGallerySchema,
  getGallerySchema,
} from "../validations/gallery.validation.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { authorize } from "@/middlewares/authorize.js";
import { uploadImage } from "@/middlewares/upload.middleware.js";
import { validate } from "@/middlewares/validate.js";
import { ROLES } from "@/constants/role.js";

const router = Router();

router.get(
  "/",
  validate(getGallerySchema, "query"),
  galleryController.getGalleryItems
);

router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  uploadImage,
  validate(createGallerySchema),
  galleryController.createGalleryItem
);

router.patch(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  uploadImage,
  validate(updateGallerySchema),
  galleryController.updateGalleryItem
);

router.delete(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  galleryController.deleteGalleryItem
);

export default router;