import { RequestHandler } from "express";
import { ZodType } from "zod";

type ValidationTarget = "body" | "query" | "params";

export const validate =
  (
    schema: ZodType,
    target: ValidationTarget = "body"
  ): RequestHandler =>
  async (req, _res, next) => {
    try {
      const parsed = await schema.parseAsync(req[target]);

      (req as any)[target] = parsed;

      next();
    } catch (error) {
      next(error);
    }
  };