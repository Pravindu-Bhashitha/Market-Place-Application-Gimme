import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: { statusCode: 404, message: `Route not found: ${req.method} ${req.originalUrl}` } });
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: { statusCode: err.statusCode, message: err.message, description: err.description } });
    return;
  }

  console.error("Unexpected error:", err);
  res.status(500).json({ error: { statusCode: 500, message: "Internal server error." } });
}