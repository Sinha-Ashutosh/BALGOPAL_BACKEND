import { NextFunction, Request, Response } from "express";

import { AppError } from "@/core/errors/app-error";
import type { Role } from "@/constants/role";

export const authorize =
  (...allowedRoles: Role[]) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    const user = req.user;

    if (!user) {
      return next(
        AppError.unauthorized("Authentication required.")
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return next(
        AppError.forbidden(
          "You are not authorized to perform this action."
        )
      );
    }

    next();
  };