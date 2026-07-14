import { Router } from "express";
import { testimonialController } from "../controllers/testimonials.controller";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
  getTestimonialSchema,
} from "../validations/testimonials.validation";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize";
import { uploadImage } from "@/middlewares/upload.middleware";
import { validate } from "@/middlewares/validate";
import { ROLES } from "@/constants/role";

const router = Router();

/**
 * Public — anyone can view active testimonials.
 */
router.get("/", testimonialController.getPublicTestimonials);

/**
 * Admin-facing — full CRUD, admin-entered only.
 */
router.get(
  "/admin",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  validate(getTestimonialSchema, "query"),
  testimonialController.getTestimonials
);

router.post(
  "/admin",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  uploadImage,
  validate(createTestimonialSchema),
  testimonialController.createTestimonial
);

router.patch(
  "/admin/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  uploadImage,
  validate(updateTestimonialSchema),
  testimonialController.updateTestimonial
);

router.delete(
  "/admin/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  testimonialController.deleteTestimonial
);

export default router;