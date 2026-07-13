import { Router } from "express";
import { settingsController } from "../controllers/settings.controller";
import { updateWebsiteSettingsSchema } from "../validations/settings.validation";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize";
import { validate } from "@/middlewares/validate";
import { ROLES } from "@/constants/role";

const router = Router();

/**
 * Public
 */
router.get("/", settingsController.getSettings);

/**
 * Protected
 */
router.patch(
  "/",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  validate(updateWebsiteSettingsSchema),
  settingsController.updateSettings
);

export default router;