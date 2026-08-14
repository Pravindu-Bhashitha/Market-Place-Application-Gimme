import { usersRepository } from "../repositories/users.repository";
import { NewUserInput, AuthResponse, PublicUser } from "../types/user.types";
import { ApiError } from "../utils/ApiError";
import { signToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";

function toPublicUser(user: { id: number; email: string }): PublicUser {
    return { id: user.id, email: user.email };
}

export const authService = {
    async register(input: NewUserInput): Promise<AuthResponse> {
        const existing = usersRepository.findByEmail(input.email);
        if (existing) {
            throw new ApiError(409, "An account with this email already exists.");
        }

        const passwordHash = await hashPassword(input.password);
        const createdAt = new Date().toISOString();

        const user = usersRepository.create({
            email: input.email,
            password: input.password,
            passwordHash,
            createdAt,
        });

        const publicUser = toPublicUser(user);
        const token = signToken(publicUser);

        return { token, user: publicUser };
    },

    async login(input: NewUserInput): Promise<AuthResponse> {
        const user = usersRepository.findByEmail(input.email);
        if (!user) {
            throw new ApiError(401, "Invalid email or password.");
        }

        const isValid = await comparePassword(input.password, user.passwordHash);
        if (!isValid) {
            throw new ApiError(401, "Invalid email or password.");
        }

        const publicUser = toPublicUser(user);
        const token = signToken(publicUser);

        return { token, user: publicUser };
    },
};