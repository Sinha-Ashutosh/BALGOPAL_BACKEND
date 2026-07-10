import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { env } from "@/config";
import type { Role } from "@/constants/role";
import { ROLE_VALUES } from "@/constants/role";

export interface JwtPayload {
  adminId: string;
  role: Role;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const jwtPayloadSchema = z.object({
  adminId: z.string().uuid(),
  role: z.enum(ROLE_VALUES),
});

class JwtService {
  /**
   * Generate an access token.
   */
  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });
  }

  /**
   * Verify an access token.
   */
  verifyAccessToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    return jwtPayloadSchema.parse(decoded);
  }

  /**
   * Generate a refresh token.
   */
  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });
  }

  /**
   * Verify a refresh token.
   */
  verifyRefreshToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    return jwtPayloadSchema.parse(decoded);
  }

  /**
   * Generate both access and refresh tokens.
   */
  generateTokenPair(payload: JwtPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Hash a refresh token before storing it.
   */
  hashRefreshToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}

export const jwtService = new JwtService();