import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { z } from "zod";
schema: "./src/database/schema/index.ts",
dotenv.config();

const DATABASE_URL = z
  .string()
  .min(1, "DATABASE_URL is required")
  .parse(process.env.DATABASE_URL);

export default defineConfig({
  schema: "./src/database/schema/index.ts",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
  strict: true,
});