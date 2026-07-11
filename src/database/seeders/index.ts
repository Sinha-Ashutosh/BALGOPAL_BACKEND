import { logger } from "@/config";
import { pool } from "@/database";
import { seedRoles } from "./roles.seeder.js";
import { seedAdmin } from "./admins.seeder.js";
async function runSeeders() {
  try {
    logger.info("Starting database seeding...");

    await seedRoles();
    await seedRoles();
    await seedAdmin();

    logger.info("Database seeding completed successfully.");
  } catch (err) {
    logger.error({ err }, "Database seeding failed.");
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runSeeders();