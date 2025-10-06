import React, { useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import UserAvatarPhoto from "@/components/UserAvatarPhoto";
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  const { user, updateUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="p-4 rounded-xl  space-y-6 w-full ">
      <div className="w-full items-start">
        <button onClick={() => navigate(-1)} className="cursor-pointer hover:scale-115 transition-transform duration-300">
          <ArrowLeft size={32} color="white"/>
        </button>
      </div>
      <div className="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-md space-y-6 w-full bg-black">
        <h2 className="text-xl text-center font-semibold text-gray-800 dark:text-gray-100">
          User Profile
        </h2>
        <div className="w-full flex items-center justify-center">
          <UserAvatarPhoto styles="w-[150px] h-[150px] p-4" />
        </div>

        {/* USER INFO */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-300">Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${
                isEditing
                  ? "border-blue-400 focus:ring-2 focus:ring-blue-400"
                  : "border-gray-300 dark:border-gray-600"
              } bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100`}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            />
          </div>
        </div>

        {/* PREFERENCES */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">Preferences</p>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-200">Theme Mode</span>

            <ThemeToggle />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
