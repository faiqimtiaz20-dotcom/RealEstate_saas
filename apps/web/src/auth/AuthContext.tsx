import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Role } from "@/auth/roles";
import { roleHasPermission, type Permission } from "@/auth/roles";

const STORAGE_KEY = "re_auth_user";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  agencyId: string;
  branchId: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  can: (permission: Permission) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const defaultMockUser: AuthUser = {
  id: "usr_1",
  email: "ana@propertydesk.demo",
  name: "Ana Sales",
  role: "broker",
  agencyId: "agc_1",
  branchId: "brc_centro",
};

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const login = useCallback((u: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    localStorage.setItem("re_mock_token", "mock-jwt");
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("re_mock_token");
    setUser(null);
  }, []);

  const setRole = useCallback(
    (role: Role) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, role };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const can = useCallback(
    (permission: Permission) => {
      if (!user) return false;
      return roleHasPermission(user.role, permission);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      setRole,
      can,
    }),
    [user, login, logout, setRole, can],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { defaultMockUser };
