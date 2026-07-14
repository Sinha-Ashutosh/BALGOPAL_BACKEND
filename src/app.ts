import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "@/config";
import authRoutes from "@/modules/auth/Routes/auth.routes";
import adminRoutes from "@/modules/admin-management/routes/admin.routes";
import settingsRoutes from "@/modules/settings/routes/settings.routes";
import galleryRoutes from "@/modules/gallery/routes/gallery.routes";
import announcementRoutes from "@/modules/announcements/routes/announcement.routes";
import testimonialsRoutes from "@/modules/testimonials/routes/testimonials.routes";
import admissionsRoutes from "@/modules/admissions/routes/admissions.routes"
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
app.use("/api/settings", settingsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/admissions", admissionsRoutes);
export default app;