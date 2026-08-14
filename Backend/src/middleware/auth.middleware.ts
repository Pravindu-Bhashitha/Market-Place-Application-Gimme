import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { JwtPayload, verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError(401, "Authentication required. Provide a Bearer token."));
    }

    const token = authHeader.slice("Bearer ".length);

    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch {
        next(new ApiError(401, "Invalid or expired token."));
    }
}