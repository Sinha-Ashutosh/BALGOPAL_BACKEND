import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { createAdminSchema } from "../validations/admin.validation";
import { authenticate } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate";
import { ROLES } from "@/constants/role";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createAdminSchema),
  adminController.createAdmin
);

export default router;