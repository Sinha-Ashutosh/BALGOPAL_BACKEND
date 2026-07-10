import { db } from "@/database";
import { roles } from "@/database/schema";
import { logger } from "@/config/index";

const DEFAULT_ROLES = [
  {
    name: "Admin",
    description: "Complete access to the application.",
  },
  {
    name: "Principal",
    description: "Can manage school information, admissions, and announcements.",
  },
  {
    name: "Teacher",
    description: "Can manage academic information and classroom-related content.",
  },
] as const;

export async function seedRoles(): Promise<void> {
  try {
    const insertedRoles = await db
      .insert(roles)
      .values(DEFAULT_ROLES)
      .onConflictDoNothing({
        target: roles.name,
      })
      .returning({
        name: roles.name,
      });

    if (insertedRoles.length === 0) {
      logger.info("Roles already exist. Skipping role seeding.");
      return;
    }

    logger.info(
      {
        insertedCount: insertedRoles.length,
        roles: insertedRoles.map((role: { name: string }) => role.name),      },
      "Roles seeded successfully."
    );
  } catch (err) {
    logger.error({ err }, "Failed to seed roles.");
    throw err;
  }
}