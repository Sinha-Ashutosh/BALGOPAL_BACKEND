import dotenv from "dotenv";
import { z } from "zod";

// Only load .env file outside production — in production, env vars
// are typically injected directly by the host (Docker, Railway, Render, etc.)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  
  JWT_ACCESS_SECRET: z.string().min(32),

  JWT_REFRESH_SECRET: z.string().min(32),

  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),

  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

  // Optional — uncomment/add as needed for your stack
  // CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  // CLOUDINARY_API_KEY: z.string().min(1).optional(),
  // CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  CORS_ORIGIN: z.string().min(1),
});

// Infer the type so it can be reused elsewhere (e.g. for typed configs, DI, etc.)
export type Env = z.infer<typeof envSchema>;

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

// Destructuring after the check guarantees correct narrowing across all TS versions
export const env: Env = parsedEnv.data;