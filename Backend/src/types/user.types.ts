export interface User {
    id: number;
    email: string;
    passwordHash: string;
    createdAt: string;
}

export interface PublicUser {
    id: number;
    email: string;
}

export interface NewUserInput {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: PublicUser;
}