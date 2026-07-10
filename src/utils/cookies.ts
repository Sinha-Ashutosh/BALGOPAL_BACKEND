import { CookieOptions, Response } from "express";

import { env } from "@/config";

const COOKIE_NAMES = {
  access: "accessToken",
  refresh: "refreshToken",
} as const;

const COOKIE_CONFIG = {
  access: {
    maxAge: 15 * 60 * 1000,
  },
  refresh: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  },
} as const;

const BASE_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
): void => {
  res.cookie(COOKIE_NAMES.access, accessToken, {
    ...BASE_COOKIE_OPTIONS,
    ...COOKIE_CONFIG.access,
  });

  res.cookie(COOKIE_NAMES.refresh, refreshToken, {
    ...BASE_COOKIE_OPTIONS,
    ...COOKIE_CONFIG.refresh,
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie(COOKIE_NAMES.access, BASE_COOKIE_OPTIONS);

  res.clearCookie(COOKIE_NAMES.refresh, {
    ...BASE_COOKIE_OPTIONS,
    path: COOKIE_CONFIG.refresh.path,
  });
};