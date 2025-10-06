import { useAuthStore } from "@/features/auth/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    // mientras carga la sesión inicial
    return <div className="flex items-center justify-center h-full bg-white dark:bg-dark-purple">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
