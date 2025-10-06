import { useUIStore } from "@/app/store/useUIStore";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useNavigate } from "react-router-dom";

interface UserAvatarPhotoProps {
  styles?: string;
}

const UserAvatarPhoto = ({ styles }: UserAvatarPhotoProps) => {
  const { isDrawerOpen, closeDrawer } = useUIStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isDrawerOpen) {
      closeDrawer();
    }
    navigate("/dashboard/profile");
  };

  return (
    <div onClick={() => handleClick()}>
      <img
        src={user?.avatar}
        alt="user profile photo"
        className={`w-10 h-10 bg-white rounded-full p-1 ${styles}`}
      />
    </div>
  );
};

export default UserAvatarPhoto;
