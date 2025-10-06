import AuthForm from "../components/AuthForm";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register, isLoading, error, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full bg-white dark:bg-dark-purple">
        <p className="text-gray-50 text-sm">Loading session…</p>
      </div>
    );
  }

  const handleRegister = async ({
    name,
    email,
    password,
  }: {
    name?: string;
    email: string;
    password: string;
  }) => {
    await register(name ?? "", email, password);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex h-screen  md:items-center justify-center dark:bg-dark-purple shadow-lg overflow-hidden">
      <div className="max-w-xl w-full">
        <AuthForm
          mode="register"
          onSubmit={handleRegister}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};
export default Register;
