import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";
import { validateNewUser, validateLogin } from "../validators/auth.validator";
import { ApiError } from "../utils/ApiError";

export const authController = {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { value, errors } = validateNewUser(req.body);
        if (!value) {
            return next(new ApiError(400, "Validation failed.", errors.join(" ")));
        }

        try {
            const result = await authService.register(value);
            res.status(201).json({ data: result });
        } catch (err) {
            next(err);
        }
    },

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { value, errors } = validateLogin(req.body);
        if (!value) {
            return next(new ApiError(400, "Validation failed.", errors.join(" ")));
        }

        try {
            const result = await authService.login(value);
            res.status(200).json({ data: result });
        } catch (err) {
            next(err);
        }
    },
};