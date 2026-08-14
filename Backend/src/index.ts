import express from "express";
import cors from "cors";
import listingsRoutes from "./routes/listings.routes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.middleware";
import { requestLogger } from "./middleware/logger.middleware";


const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/listings", listingsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Market Place API Server is running on port ${PORT}`);
});