import "dotenv/config";
import express from "express";
import cors from "cors";
import listingsRoutes from "./routes/listings.routes";
import authRoutes from "./routes/auth.routes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.middleware";
import { requestLogger } from "./middleware/logger.middleware";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/listings", listingsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}