import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "./authContext";
import {
  fetchCurrentUser,
  loginRequest,
  registerRequest,
} from "../api/authApi";
import { setUnauthorizedHandler, tokenStorage } from "../api/client";
import type { User } from "../types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // If a token is stored, we must verify it with the server before deciding
  // whether the visitor is logged in, so start in the loading state.
  const [isLoading, setIsLoading] = useState<boolean>(
    () => tokenStorage.get() !== null
  );

  useEffect(() => {
    if (!tokenStorage.get()) return;

    let cancelled = false;
    fetchCurrentUser()
      .then(({ user }) => {
        if (!cancelled) setUser(user);
      })
      .catch(() => {
        tokenStorage.clear();
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      tokenStorage.clear();
      setUser(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await loginRequest(email, password);
    tokenStorage.set(token);
    setUser(user);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { token, user } = await registerRequest(name, email, password);
      tokenStorage.set(token);
      setUser(user);
    },
    []
  );

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
