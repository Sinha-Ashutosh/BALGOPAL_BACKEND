import { Router } from "express";

import { admissionController } from "../controllers/admission.controller.js";

import {
  createAdmissionSchema,
  getAdmissionSchema,
  updateAdmissionSchema,
  updateAdmissionStatusSchema,
} from "../validations/admission.validation.js";

import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize";
import { validate } from "@/middlewares/validate";

import { ROLES } from "@/constants/role";

const router = Router();

/**
 * Public
 * Parents submit admission enquiries.
 */
router.post(
  "/",
  validate(createAdmissionSchema),
  admissionController.createAdmission
);

/**
 * Admin
 * List all admissions.
 */
router.get(
  "/admin",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  validate(getAdmissionSchema, "query"),
  admissionController.getAdmissions
);

/**
 * Admin
 * Get a single admission.
 */
router.get(
  "/admin/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  admissionController.getAdmissionById
);

/**
 * Admin
 * Update admission details.
 */
router.patch(
  "/admin/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  validate(updateAdmissionSchema),
  admissionController.updateAdmission
);

/**
 * Admin
 * Update admission status only.
 */
router.patch(
  "/admin/:id/status",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  validate(updateAdmissionStatusSchema),
  admissionController.updateAdmissionStatus
);

/**
 * Admin
 * Delete an admission.
 */
router.delete(
  "/admin/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  admissionController.deleteAdmission
);

export default router;