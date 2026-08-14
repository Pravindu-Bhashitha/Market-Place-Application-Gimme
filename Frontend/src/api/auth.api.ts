import axiosClient from "./axiosClient";
import type { AuthResponse, LoginInput, RegisterInput } from "../types/auth.types";

export const authApi = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const res = await axiosClient.post<{ data: AuthResponse }>("/auth/register", input);
    return res.data.data;
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const res = await axiosClient.post<{ data: AuthResponse }>("/auth/login", input);
    return res.data.data;
  },
};