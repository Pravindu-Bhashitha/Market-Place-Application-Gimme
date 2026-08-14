import { NewUserInput } from "../types/user.types";

interface ValidationResult {
  value?: NewUserInput;
  errors: string[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateNewUser(body: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof body !== "object" || body === null) {
    return { errors: ["Request body must be a JSON object."] };
  }

  const b = body as Record<string, unknown>;

  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  if (!email) errors.push("email is required.");
  else if (!EMAIL_REGEX.test(email)) errors.push("email must be a valid email address.");

  const password = typeof b.password === "string" ? b.password : "";
  if (!password) errors.push("password is required.");
  else if (password.length < 8) errors.push("password must be at least 8 characters.");

  if (errors.length > 0) return { errors };

  return { value: { email, password }, errors: [] };
}

export function validateLogin(body: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof body !== "object" || body === null) {
    return { errors: ["Request body must be a JSON object."] };
  }

  const b = body as Record<string, unknown>;

  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  if (!email) errors.push("email is required.");

  const password = typeof b.password === "string" ? b.password : "";
  if (!password) errors.push("password is required.");

  if (errors.length > 0) return { errors };

  return { value: { email, password }, errors: [] };
}