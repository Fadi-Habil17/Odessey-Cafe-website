import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import {
  clearToken,
  fetchCurrentAdmin,
  getStoredToken,
  loginAdmin,
  storeToken,
} from "../services/api";
import type { Admin, LoginPayload } from "../types";

interface AuthContextValue {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, check if a token already exists and is still valid
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetchCurrentAdmin()
      .then(setAdmin)
      .catch(() => {
        clearToken();
        setAdmin(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { token, admin: loggedInAdmin } = await loginAdmin(payload);
    storeToken(token);
    setAdmin(loggedInAdmin);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ admin, isLoading, isAuthenticated: !!admin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth يجب أن يُستخدم داخل AuthProvider");
  }
  return context;
}
