import { and, eq, gt, isNull, lt } from "drizzle-orm";
import { db } from "@/database";
import { refreshTokens } from "@/database/schema";

interface RefreshTokenMeta {
  userAgent?: string;
  ipAddress?: string;
}

export class RefreshTokenRepository {
  /**
   * Create a new refresh token record.
   */
  async create(
    adminId: string,
    tokenHash: string,
    expiresAt: Date,
    meta?: RefreshTokenMeta
  ): Promise<typeof refreshTokens.$inferSelect> {
    const [token] = await db
      .insert(refreshTokens)
      .values({
        adminId,
        tokenHash,
        expiresAt,
        userAgent: meta?.userAgent,
        ipAddress: meta?.ipAddress,
      })
      .returning();
    return token;
  }

  /**
   * Find a valid (non-expired & non-revoked) refresh token.
   */
  async findValidByHash(
    tokenHash: string
  ): Promise<typeof refreshTokens.$inferSelect | null> {
    const [token] = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.tokenHash, tokenHash),
          isNull(refreshTokens.revokedAt),
          gt(refreshTokens.expiresAt, new Date())
        )
      )
      .limit(1);
    return token ?? null;
  }

  /**
   * Revoke a refresh token.
   */
  async revoke(
    tokenHash: string
  ): Promise<typeof refreshTokens.$inferSelect | null> {
    const [token] = await db
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
      })
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .returning();
    return token ?? null;
  }

  /**
   * Revoke all active refresh tokens for an admin.
   */
  async revokeAllForAdmin(adminId: string): Promise<number> {
    const revokedTokens = await db
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
      })
      .where(
        and(
          eq(refreshTokens.adminId, adminId),
          isNull(refreshTokens.revokedAt)
        )
      )
      .returning({
        id: refreshTokens.id,
      });
    return revokedTokens.length;
  }

  /**
   * Update the last-used timestamp.
   */
  async touchLastUsed(
    tokenHash: string
  ): Promise<typeof refreshTokens.$inferSelect | null> {
    const [token] = await db
      .update(refreshTokens)
      .set({
        lastUsedAt: new Date(),
      })
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .returning();
    return token ?? null;
  }

  /**
   * Delete expired refresh tokens.
   * Useful for scheduled cleanup jobs.
   */
  async deleteExpired(): Promise<number> {
    const deletedTokens = await db
      .delete(refreshTokens)
      .where(lt(refreshTokens.expiresAt, new Date()))
      .returning({
        id: refreshTokens.id,
      });
    return deletedTokens.length;
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();