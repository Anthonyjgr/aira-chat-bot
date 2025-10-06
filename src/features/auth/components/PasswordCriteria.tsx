import { CheckCircle, Circle } from "lucide-react";

interface PasswordCriteriaProps {
  password: string;
  confirmPassword: string;
}

const PasswordCriteria = ({ password, confirmPassword }: PasswordCriteriaProps) => {
  // individuals rules
  const rules = [
    {
      label: "At least 6 characters",
      test: password.length >= 6,
    },
    {
      label: "One uppercase letter (A–Z)",
      test: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter (a–z)",
      test: /[a-z]/.test(password),
    },
    {
      label: "One special character (@$!%*?&)",
      test: /[!@\$%\*\?&]/.test(password),
    },
    {
      label: "Both passwords match",
      test: password && password === confirmPassword,
    },
  ];

  return (
    <div
      className="space-y-1 mt-2 text-sm"
      aria-live="polite"
      aria-label="Password requirements"
    >
      {rules.map((rule, index) => (
        <div key={index} className="flex items-center gap-2">
          {rule.test ? (
            <CheckCircle className="text-green-500 h-4 w-4" aria-hidden="true" />
          ) : (
            <Circle className="text-gray-400 h-4 w-4" aria-hidden="true" />
          )}
          <span className={rule.test ? "text-white font-medium" : "text-gray-300"}>
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PasswordCriteria;
