import { eq } from "drizzle-orm";

import { db } from "@/database";
import { admins, roles } from "@/database/schema";
import { Role } from "@/constants/role";

import type { AdminWithRole } from "@/modules/auth/types/admin-with-role";

export class AdminRepository {
  /**
   * Find an admin by email.
   * Returns the complete admin record (including password hash).
   * Intended for internal authentication use only.
   */
  async findByEmail(
    email: string
  ): Promise<AdminWithRole | null> {
    const [admin] = await db
      .select({
        id: admins.id,
        name: admins.name,
        email: admins.email,
        password: admins.password,
        phone: admins.phone,
        profileImage: admins.profileImage,
        role: roles.name,
        isActive: admins.isActive,
        lastLogin: admins.lastLogin,
        createdAt: admins.createdAt,
        updatedAt: admins.updatedAt,
    })
    .from(admins)
    .innerJoin(roles, eq(admins.roleId, roles.id))
    .where(eq(admins.email, email))
    .limit(1);

    return admin ?? null;
  }

  /**
   * Find an admin by ID.
   */
  async findById(
    id: string
  ): Promise<AdminWithRole | null> {
    const [admin] = await db
      .select({
        id: admins.id,
        name: admins.name,
        email: admins.email,
        password: admins.password,
        phone: admins.phone,
        profileImage: admins.profileImage,
        role: roles.name,
        isActive: admins.isActive,
        lastLogin: admins.lastLogin,
        createdAt: admins.createdAt,
        updatedAt: admins.updatedAt,
    })
      .from(admins)
      .innerJoin(roles, eq(admins.roleId, roles.id))
      .where(eq(admins.id, id))
      .limit(1);

    return admin ?? null;
  }

  /**
   * Create a new admin.
   */
  async create(
    data: typeof admins.$inferInsert
  ): Promise<typeof admins.$inferSelect> {
    const [admin] = await db
      .insert(admins)
      .values(data)
      .returning();

    return admin;
  }

  /**
   * Update the last login timestamp.
   */
  async updateLastLogin(
    id: string
  ): Promise<typeof admins.$inferSelect | null> {
    const [admin] = await db
      .update(admins)
      .set({
        lastLogin: new Date(),
      })
      .where(eq(admins.id, id))
      .returning();

    return admin ?? null;
  }
}

export const adminRepository = new AdminRepository();