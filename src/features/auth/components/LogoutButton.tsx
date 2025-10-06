import { useAuthStore } from "@/features/auth/store/auth.store";
import { LogOut } from "lucide-react";
import React from "react";

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
        className="flex flew-row justify-between w-full p-4 bg-white rounded-lg text-black cursor-pointer "
      >
        <span>Logout</span>
        <LogOut color="red" size={20} />
      </button>
    </div>
  );
};

export default LogoutButton;
