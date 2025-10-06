import { useEffect, useState } from "react";
import PasswordCriteria from "./PasswordCriteria";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import Bot from "@/features/home/components/Bot";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: { name?: string; email: string; password: string }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Regex mejorado para contraseña segura
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@\$%\*\?&]).{6,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthForm = ({ mode, onSubmit, isLoading, error }: AuthFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isFirstAttempt, setIsFirstAttempt] = useState(true);

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (mode === "register" && !name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = "Please enter a valid email (e.g., name@example.com).";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (mode === "register" && !PASSWORD_REGEX.test(password)) {
      newErrors.password =
        "Password must be at least 6 characters, include one uppercase, one lowercase, and one special character (@$!%*?&).";
    }

    if (mode === "register") {
      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = "Please confirm your password.";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setFieldErrors(newErrors);
  }, [name, email, password, confirmPassword, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(fieldErrors).length > 0) {
      setIsFirstAttempt(false);
      return;
    }

    try {
      if (mode === "register") {
        await onSubmit({ name, email, password });
        setFieldErrors({});
      } else {
        await onSubmit({ email, password });
        setFieldErrors({});
      }
    } catch {
      // el error global se maneja desde el store
    }
  };

  return (
    <div className="p-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4  bg-primary rounded-xl p-6 shadow-xl relative"
        aria-describedby={error ? "form-global-error" : undefined}
        noValidate
      >
        <div
          className="absolute scale-30 md:scale-50 w-[700px] md:w-[800px] z-20 inset-0 -left-20 -bottom-[1100px] md:left-50 md:top-40"
          pointer-events="none"
        >
          <Bot />
        </div>
        <h1 className="text-center my-10 text-5xl font-semibold text-white">
          {mode === "register" ? "Sign up" : "Sign in"}
        </h1>
        {mode === "register" && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Full name
            </label>
            <input
              id="name"
              type="text"
              className="mt-1 block w-full border rounded-full p-2 bg-white dark:bg-dark-purple/50 focus:outline-secundary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              aria-required="true"
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
            />
            {!isFirstAttempt && fieldErrors.name && (
              <p id="name-error" className="text-red-300 text-sm mt-1">
                {fieldErrors.name}
              </p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 block w-full border rounded-full p-2 bg-white dark:bg-dark-purple/50 focus:outline-secundary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            placeholder="name@example.com"
          />
          {!isFirstAttempt && fieldErrors.email && (
            <p id="email-error" className="text-red-300 text-sm mt-1">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium text-white">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="mt-1 block w-full border rounded-full p-2 pr-10 bg-white dark:bg-dark-purple/50 z-20 focus:outline-secundary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            aria-required="true"
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
            placeholder="••••••"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-8.5 text-gray-500 hover:text-gray-700 focus:outline-none z-20"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <Eye className="w-5 h-5" aria-hidden="true" />
            ) : (
              <EyeOff className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {mode === "register" && (
          <div className="relative">
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              className="mt-1 block w-full border rounded-full p-2 pr-10 bg-white dark:bg-dark-purple/50 z-20 focus:outline-secundary"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              aria-required="true"
              aria-invalid={!!fieldErrors.confirmPassword}
              aria-describedby={
                fieldErrors.confirmPassword ? "confirm-password-error" : undefined
              }
              placeholder="••••••"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none z-20"
              aria-label={
                showPassword ? "Hide confirm password" : "Show confirm password"
              }
            >
              {showPassword ? (
                <Eye className="w-5 h-5" aria-hidden="true" />
              ) : (
                <EyeOff className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
            {!isFirstAttempt && fieldErrors.password && (
              <p id="name-error" className="text-red-300 text-sm mt-1 z-20">
                {fieldErrors.password}
              </p>
            )}
          </div>
        )}
        {mode === "register" && (
          <PasswordCriteria password={password} confirmPassword={confirmPassword} />
        )}
        {error && (
          <div
            id="form-global-error"
            role="alert"
            aria-live="assertive"
            className="text-red-600 text-sm mt-2"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full hover:bg-white hover:text-black transition-all duration-100 ease-in-out text-white bg-white/40 dark:bg-white/40  dark:text-white py-2 rounded-full disabled:opacity-50 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Loading…" : mode === "register" ? "Register" : "Login"}
        </button>
        {mode !== "register" ? (
          <Link to="/register" className="flex items-center justify-center w-full">
            <span className="text-center text-white">
              Don't have an account? Click here to signup
            </span>
          </Link>
        ) : (
          <Link to="/login" className="text-white flex items-center justify-center w-full">
            <span className="text-center">Already registered? Click here to sign in</span>
          </Link>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
