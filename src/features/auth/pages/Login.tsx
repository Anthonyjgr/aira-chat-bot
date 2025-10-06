import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import AuthForm from "../components/AuthForm";

const Login = () => {
  const { login, isLoading, error, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p className="text-gray-50 text-sm">Loading session…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen md:items-center justify-center dark:bg-dark-purple shadow-lg overflow-hidden">
      <div className="max-w-xl w-full">
        <AuthForm
          mode="login"
          onSubmit={({ email, password }) => login(email, password)}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Login;
