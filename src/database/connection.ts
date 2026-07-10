import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env, logger } from "@/config";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl:
    env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

pool.on("error", (err) => {
  logger.error({ err }, "Unexpected PG pool error");
});

export const db = drizzle(pool);
export type Database = typeof db;