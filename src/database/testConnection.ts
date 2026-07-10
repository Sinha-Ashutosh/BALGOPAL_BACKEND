import { sql } from "drizzle-orm";
import { db, pool } from "./index.js";
import { logger } from "@/config";

async function testConnection() {
  try {
    const result = await db.execute(sql`SELECT 1`);

    logger.info(
      { result: result.rows },
      "✅ Database connected successfully"
    );

    process.exitCode = 0;
  } catch (err) {
    logger.error({ err }, "❌ Database connection failed");
    process.exitCode = 1;
  } finally {
    try {
      await pool.end();
    } catch (err) {
      logger.error({ err }, "Error closing database pool");
    }
  }
}

testConnection();