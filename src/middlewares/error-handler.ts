import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { logger } from "@/config";
import { AppError } from "@/core/errors/app-error";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      data: {},
      err: error.flatten().fieldErrors,
    });

    return;
  }

  if (error instanceof AppError) {
    const statusCode =
      Number.isInteger(error.statusCode) &&
      error.statusCode >= 100 &&
      error.statusCode < 600
        ? error.statusCode
        : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
      data: {},
      err: {},
    });

    return;
  }

  logger.error({ err: error }, "Unhandled Error");

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    data: {},
    err: {},
  });
};