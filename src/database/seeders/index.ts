import { logger } from "@/config";
import { pool } from "@/database";
import { seedRoles } from "./roles.seeder.js";

async function runSeeders() {
  try {
    logger.info("Starting database seeding...");

    await seedRoles();

    logger.info("Database seeding completed successfully.");
  } catch (err) {
    logger.error({ err }, "Database seeding failed.");
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runSeeders();