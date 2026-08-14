import jwt from "jsonwebtoken";
import { PublicUser } from "../types/user.types";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set. Add it to .env file.");
}

export interface JwtPayload {
  userId: number;
  email: string;
}

export const signToken = (user: PublicUser): string => {
  const payload: JwtPayload = { userId: user.id, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};