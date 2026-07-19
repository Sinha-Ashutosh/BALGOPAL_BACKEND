import bcrypt from "bcrypt";

import { adminRepository } from "@/repositories/admin.repository";
import { refreshTokenRepository } from "@/repositories/refresh-token.repository";
import { AdminWithRole } from "@/types/admin-with-role";
import { jwtService } from "./jwt.service";
import { Role } from "@/src/constants/role";

export interface SessionMetadata {
  userAgent?: string;
  ipAddress?: string;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends SessionTokens {
  admin: {
    id: string;
    name: string;
    email: string;
    roleId: Role;
  };
}

/**
 * Used to keep bcrypt timing consistent even when no admin is found,
 * preventing attackers from enumerating valid email addresses based
 * on response time.
 */
const DUMMY_PASSWORD_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8gY6qKf7XwLp3Z9L3Jv8bqf1qJrKzO";

export class AuthService {
  /**
   * Returns the expiry date for newly created refresh tokens.
   */
  private getRefreshTokenExpiry(): Date {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  /**
   * Creates a new authenticated session.
   */
  private async createSession(
    adminId: string,
    role: Role,
    meta?: SessionMetadata
  ): Promise<SessionTokens> {
    const { accessToken, refreshToken } = jwtService.generateTokenPair({
      adminId,
      role,
    });

    await refreshTokenRepository.create(
      adminId,
      jwtService.hashRefreshToken(refreshToken),
      this.getRefreshTokenExpiry(),
      meta
    );

    await adminRepository.updateLastLogin(adminId);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticate an admin and create a new session.
   */
  async login(
    email: string,
    password: string,
    meta?: SessionMetadata
  ): Promise<LoginResponse> {
    const normalizedEmail = email.trim().toLowerCase();

    const admin = await adminRepository.findByEmail(normalizedEmail);

    // Always compare against a hash to keep response timing consistent.
    const passwordMatches = await bcrypt.compare(
      password,
      admin?.password ?? DUMMY_PASSWORD_HASH
    );

    if (!admin || !admin.isActive || !passwordMatches) {
      throw new Error("Invalid email or password.");
    }

     const tokens = await this.createSession(
      admin.id,
      admin.role,
      meta
    );

    return {
      ...tokens,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        roleId: admin.role,
      },
    };
  }

  /**
   * Rotate a refresh token and create a new session.
   */
  async refresh(
    refreshToken: string,
    meta?: SessionMetadata
  ): Promise<SessionTokens> {
    const payload = jwtService.verifyRefreshToken(refreshToken);

    const tokenHash = jwtService.hashRefreshToken(refreshToken);

    const storedToken =
      await refreshTokenRepository.findValidByHash(tokenHash);

    if (!storedToken) {
      throw new Error("Refresh token is invalid.");
    }

    await refreshTokenRepository.touchLastUsed(tokenHash);
    await refreshTokenRepository.revoke(tokenHash);

    return this.createSession(
      payload.adminId,
      payload.role,
      meta
    );
  }

  /**
   * Logout the current session.
   */
  async logout(refreshToken: string): Promise<void> {
    const tokenHash = jwtService.hashRefreshToken(refreshToken);

    await refreshTokenRepository.revoke(tokenHash);
  }

  /**
   * Logout from every active session.
   */
  async logoutAll(adminId: string): Promise<void> {
    await refreshTokenRepository.revokeAllForAdmin(adminId);
  }

  /**
   * Returns the currently authenticated admin without the password hash.
   */
  // auth.service.ts
async me(adminId: string): Promise<Omit<AdminWithRole, "password"> | null> {
  const admin = await adminRepository.findById(adminId);
  if (!admin) return null;

  const { password, ...safeAdmin } = admin;
  return safeAdmin;
}
}

export const authService = new AuthService();