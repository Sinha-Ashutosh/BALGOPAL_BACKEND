import { Router } from "express";
import rateLimit from "express-rate-limit";
import { contactMessageController } from "../controllers/contact-message.controller.js";
import {
  createContactMessageSchema,
  updateContactMessageSchema,
  getContactMessageSchema,
} from "../validations/contact-message.validation.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { authorize } from "@/middlewares/authorize.js";
import { validate } from "@/middlewares/validate.js";
import { ROLES } from "@/constants/role.js";

const router = Router();

// Stricter than your global limiter (100/15min) — a contact form
// shouldn't legitimately be submitted more than a few times per hour
// from the same IP.
const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many messages sent. Please try again later.",
    data: {},
    err: {},
  },
});

/**
 * Public — anyone can submit a contact message.
 */
router.post(
  "/",
  contactFormLimiter,
  validate(createContactMessageSchema),
  contactMessageController.submitMessage
);

/**
 * Admin-facing — view, mark read/unread, delete.
 */
router.get(
  "/admin",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  validate(getContactMessageSchema, "query"),
  contactMessageController.getMessages
);


router.get(
  "/admin/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  contactMessageController.getMessageById
);

router.patch(
  "/admin/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  validate(updateContactMessageSchema),
  contactMessageController.markAsRead
);

router.delete(
  "/admin/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.PRINCIPAL),
  contactMessageController.deleteMessage
);

export default router;