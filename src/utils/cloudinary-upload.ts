import { cloudinary } from "@/config/cloudinary";
import { AppError } from "@/core/errors/app-error";
import {
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
interface UploadResult {
  url: string;
  publicId: string;
}

export function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
    (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(
            new AppError(
              "Failed to upload image to Cloudinary.",
              502
        )
    );
    }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(
  publicId: string
): Promise<void> {
  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result !== "ok" && result.result !== "not found") {
    throw new AppError(
      "Failed to delete image from Cloudinary.",
      502
    );
  }
}