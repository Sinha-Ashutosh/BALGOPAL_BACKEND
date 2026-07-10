import { eq } from "drizzle-orm";

import { db } from "@/database";
import { admins } from "@/database/schema";

export class AdminRepository {
  /**
   * Find an admin by email.
   * Returns the complete admin record (including password hash).
   * Intended for internal authentication use only.
   */
  async findByEmail(
    email: string
  ): Promise<typeof admins.$inferSelect | null> {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);

    return admin ?? null;
  }

  /**
   * Find an admin by ID.
   */
  async findById(
    id: string
  ): Promise<typeof admins.$inferSelect | null> {
    const [admin] = await db
      .select()
      .from(admins)
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