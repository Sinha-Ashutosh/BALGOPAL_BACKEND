import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { logger, env } from "@/config/index";
import { db } from "@/database/index";
import { admins, roles } from "@/database/schema/index";

const DEFAULT_ADMIN = {
  name: "Ashutosh Sinha",
  email: "admin@balgopal.com".toLowerCase().trim(),
} as const;

export async function seedAdmin(): Promise<void> {
  try {
    // Check if the default admin already exists
    const existingAdmin = await db.query.admins.findFirst({
      where: eq(admins.email, DEFAULT_ADMIN.email),
    });

    if (existingAdmin) {
      logger.info("Default admin already exists. Skipping admin seeding.");
      return;
    }

    // Get the Admin role
    const adminRole = await db.query.roles.findFirst({
      where: eq(roles.name, "Admin"),
    });

    if (!adminRole) {
      throw new Error("Admin role not found. Please seed roles first.");
    }

    // Read password from environment
    const password = env.DEFAULT_ADMIN_PASSWORD;

    if (!password) {
      throw new Error(
        "DEFAULT_ADMIN_PASSWORD is missing. Refusing to seed default admin."
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const [createdAdmin] = await db
      .insert(admins)
      .values({
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        password: hashedPassword,
        roleId: adminRole.id,
        isActive: true,
      })
      .returning({
        id: admins.id,
        name: admins.name,
        email: admins.email,
      });

    logger.info(
      {
        adminId: createdAdmin.id,
        email: createdAdmin.email,
      },
      "✅ Default admin created successfully."
    );
  } catch (err) {
    logger.error({ err }, "Failed to seed default admin.");
    throw err;
  }
}