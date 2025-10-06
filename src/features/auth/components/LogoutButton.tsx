import { useAuthStore } from "@/features/auth/store/auth.store";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div className="pr-2">
      <button
        onClick={() => handleLogout()}
        className="flex flew-row justify-between w-full p-2 bg-white dark:bg-primary/20 rounded-lg text-black cursor-pointer "
      >
        <span className="dark:text-primary">Logout</span>
        <LogOut className="text-primary" size={20} />
      </button>
    </div>
  );
};

export default LogoutButton;
