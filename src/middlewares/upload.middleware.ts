import multer from "multer";
import { AppError } from "@/core/errors/app-error";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new AppError(
          "Only JPEG, PNG, and WEBP images are allowed.",
          400
        )
      );
    }

    cb(null, true);
  },
}).single("image");