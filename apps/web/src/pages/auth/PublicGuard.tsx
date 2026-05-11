import { useAuth } from "@/auth/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function PublicGuard() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
