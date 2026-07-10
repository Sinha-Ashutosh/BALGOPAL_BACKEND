import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { loginSchema } from "../validations/auth.validation";

import { authenticate } from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate";

const router = Router();

/**
 * Public Routes
 */
router.post("/login", validate(loginSchema), authController.login);

router.post("/refresh", authController.refresh);

/**
 * Protected Routes
 */
router.post("/logout", authenticate, authController.logout);

router.post("/logout-all", authenticate, authController.logoutAll);

router.get("/me", authenticate, authController.me);

export default router;