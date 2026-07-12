import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { createAdminSchema, getAdminsSchema, getAdminByIdSchema, updateAdminSchema } from "../validations/admin.validation";
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

router.get(
  "/",
  authenticate,
  validate(getAdminsSchema, "query"),
  adminController.getAdmins
);

router.get(
  "/:id",
  authenticate,
  validate(getAdminByIdSchema, "params"),
  adminController.getAdminById
);

router.patch(
  "/:id",
  authenticate,
  validate(getAdminByIdSchema, "params"),
  validate(updateAdminSchema),
  adminController.updateAdmin
);

router.delete(
  "/:id",
  authenticate,
  validate(getAdminByIdSchema, "params"),
  adminController.deleteAdmin
);

export default router;