import app from "./app";
import { env, logger } from "@/config";

const server = app.listen(env.PORT, () => {
 logger.info(
  {
    port: env.PORT,
    env: env.NODE_ENV,
  },
  `Server running at http://localhost:${env.PORT}`
);
});

// Catch errors the app itself doesn't handle (e.g. bad Promise chains)
process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught Exception");
  shutdown("UNCAUGHT_EXCEPTION");
});
process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled Rejection");
  shutdown("UNHANDLED_REJECTION");
});
// Graceful shutdown for Docker/Kubernetes/Render/etc.
const shutdown = (signal: string) => {
 logger.info(
  { signal },
  "Server shut down successfully."
);
  server.close(() => {
   logger.info(
  { signal },
  "Server shut down successfully."
);
    process.exit(0);
  });

  // Force-exit if it hangs (e.g. open DB connections not closing)
  setTimeout(() => {
   logger.error(
  { signal },
  "Forced shutdown after 10 seconds."
);
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default server;