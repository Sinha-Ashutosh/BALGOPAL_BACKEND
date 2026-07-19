import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize";
import { ROLES } from "@/constants/role";

const router = Router();

router.get(
  "/stats",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  dashboardController.getStats
);

router.get(
  "/recent-admissions",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  dashboardController.getRecentAdmissions
);

export default router;