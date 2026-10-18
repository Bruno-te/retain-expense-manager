import { api } from "./client";
import type { AuthResponse, User } from "../types";

export const loginRequest = (email: string, password: string) =>
  api.post<AuthResponse>("/auth/login", { email, password });

export const registerRequest = (name: string, email: string, password: string) =>
  api.post<AuthResponse>("/auth/register", { name, email, password });

export const fetchCurrentUser = () => api.get<{ user: User }>("/auth/me");
