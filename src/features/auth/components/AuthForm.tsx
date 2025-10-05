import React, { useEffect, useState } from "react";
import PasswordCriteria from "./PasswordCriteria";
import { Eye, EyeOff } from "lucide-react";

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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4"
      aria-describedby={error ? "form-global-error" : undefined}
      noValidate
    >
      {mode === "register" && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            type="text"
            className="mt-1 block w-full border rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
          />
          {!isFirstAttempt && fieldErrors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1">
              {fieldErrors.name}
            </p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="mt-1 block w-full border rounded p-2"
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
          <p id="email-error" className="text-red-500 text-sm mt-1">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          className="mt-1 block w-full border rounded p-2 pr-10"
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
          className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
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
            className="mt-1 block w-full border rounded p-2 pr-10"
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
            className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showPassword ? (
              <Eye className="w-5 h-5" aria-hidden="true" />
            ) : (
              <EyeOff className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
          {!isFirstAttempt && fieldErrors.password && (
            <p id="name-error" className="text-red-500 text-sm mt-1">
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
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Loading…" : mode === "register" ? "Register" : "Login"}
      </button>
    </form>
  );
};

export default AuthForm;
