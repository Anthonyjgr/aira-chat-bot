import { useAuthStore } from "@/features/auth/store/auth.store";
import { Link } from "react-router-dom";

interface UserAvatarPhotoProps {
  styles?: string;
}

const UserAvatarPhoto = ({ styles }: UserAvatarPhotoProps) => {
  const { user } = useAuthStore();


  return (
    <Link to="/dashboard/profile">
      <div>
        <img
          src={user?.avatar}
          alt="user profile photo"
          className={`w-10 h-10 bg-white rounded-full p-1 ${styles}`}
        />
      </div>
    </Link>
  );
};

export default UserAvatarPhoto;
