import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env, logger } from "@/config/index";
import * as schema from "@/database/schema";

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

export const db = drizzle(pool, { schema });
export type Database = typeof db;