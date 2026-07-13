import { Router } from "express";
import { announcementController } from "../controllers/announcement.controller.js";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  getAnnouncementSchema,
} from "../validations/announcement.validation.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { authorize } from "@/middlewares/authorize.js";
import { validate } from "@/middlewares/validate.js";
import { ROLES } from "@/constants/role.js";

const router = Router();

/**
 * Public — anyone can view currently active, published announcements.
 */
router.get("/", announcementController.getPublicAnnouncements);

/**
 * Admin-facing — full CRUD, and a separate listing that shows
 * everything (drafts, scheduled, expired) for management purposes.
 */
router.get(
  "/admin",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  validate(getAnnouncementSchema, "query"),
  announcementController.getAnnouncements
);

router.post(
  "/admin",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  validate(createAnnouncementSchema),
  announcementController.createAnnouncement
);

router.patch(
  "/admin/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  validate(updateAnnouncementSchema),
  announcementController.updateAnnouncement
);

router.delete(
  "/admin/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  announcementController.deleteAnnouncement
);

export default router;