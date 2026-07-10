import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { AppError } from "@/core/errors/app-error";
import { jwtService } from "@/modules/auth/services/jwt.service";
import { COOKIE_NAMES } from "@/utils/cookies";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const accessToken = req.cookies?.[COOKIE_NAMES.access];

  if (!accessToken) {
    return next(
      AppError.unauthorized("Access token is missing.")
    );
  }

  try {
    const payload = jwtService.verifyAccessToken(accessToken);

    req.user = payload;

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(
        AppError.unauthorized("Access token expired.")
      );
    }

    if (error instanceof JsonWebTokenError) {
      return next(
        AppError.unauthorized("Invalid access token.")
      );
    }

    // Unexpected failure (misconfiguration, key issues, etc.)
    return next(error);
  }
};