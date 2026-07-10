import type { JwtPayload } from "@/modules/auth/services/jwt.service";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};