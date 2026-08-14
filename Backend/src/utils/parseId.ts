import { ApiError } from "./ApiError";

export function parseId(rawId: string): number {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, "Invalid ID. ID must be a positive integer.");
  }
  return id;
}