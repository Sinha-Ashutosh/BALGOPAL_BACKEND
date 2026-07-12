import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "@/config";
import authRoutes from "@/modules/auth/Routes/auth.routes";
import adminRoutes from "@/modules/admin-management/routes/admin.routes.js";

const app = express();

// Needed if running behind a reverse proxy (Render, Railway, Nginx, etc.)
app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
origin: env.CORS_ORIGIN.split(","),
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
// Basic rate limiting — tune per route as needed (e.g. stricter on /auth)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);

export default app;