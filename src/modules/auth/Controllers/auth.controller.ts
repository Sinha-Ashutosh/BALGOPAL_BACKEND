import { Request, Response } from "express";

import { AppError } from "@/core/errors/app-error";
import { asyncHandler } from "@/middlewares/async-handler";
import { clearAuthCookies, setAuthCookies } from "@/utils/cookies";
import { response } from "@/utils/response";

import { authService } from "../services/auth.service";
import type {
  LoginDto,
} from "../validations/auth.validation";

const getRefreshToken = (req: Request): string => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw AppError.unauthorized("Refresh token missing.");
  }

  return token;
};

const login = asyncHandler(
  async (
    req: Request<Record<string, never>, object, LoginDto>,
    res: Response
  ) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password, {
      userAgent: req.get("user-agent"),
      ipAddress: req.ip,
    });

    setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken
    );

    return response.success(
      res,
      {
        admin: result.admin,
      },
      "Login successful."
    );
  }
);

const refresh = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = getRefreshToken(req);

    const result = await authService.refresh(
      refreshToken,
      {
        userAgent: req.get("user-agent"),
        ipAddress: req.ip,
      }
    );

    setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken
    );

    return response.success(
      res,
      {},
      "Token refreshed successfully."
    );
  }
);

const logout = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    clearAuthCookies(res);

    return response.success(
      res,
      {},
      "Logged out successfully."
    );
  }
);

const logoutAll = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.logoutAll(req.user.adminId);

    clearAuthCookies(res);

    return response.success(
      res,
      {},
      "Logged out from all sessions."
    );
  }
);

const me = asyncHandler(
  async (req: Request, res: Response) => {
    const admin = await authService.me(req.user.adminId);

    return response.success(
      res,
      admin,
      "Admin fetched successfully."
    );
  }
);

export const authController = {
  login,
  refresh,
  logout,
  logoutAll,
  me,
};