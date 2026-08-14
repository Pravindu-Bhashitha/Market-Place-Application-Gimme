import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { authApi } from "../api/auth.api";
import type { LoginInput, PublicUser, RegisterInput } from "../types/auth.types";
import { AUTH_STORAGE_KEY } from "../constants/auth.constants";

interface AuthContextValue {
  user: PublicUser | null;
  token: string | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { user: PublicUser; token: string };
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persist = (nextUser: PublicUser, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }));
  };

  const extractErrorMessage = (err: unknown, fallback: string) =>
    axios.isAxiosError(err) ? err.response?.data?.error?.message ?? fallback : fallback;

  const login = async (input: LoginInput) => {
    try {
      const result = await authApi.login(input);
      persist(result.user, result.token);
    } catch (err) {
      throw new Error(extractErrorMessage(err, "Login failed."));
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      const result = await authApi.register(input);
      persist(result.user, result.token);
    } catch (err) {
      throw new Error(extractErrorMessage(err, "Registration failed."));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};