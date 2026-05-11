import { useAuth } from "@/auth/AuthContext";
import { Navigate } from "react-router-dom";

export function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}
