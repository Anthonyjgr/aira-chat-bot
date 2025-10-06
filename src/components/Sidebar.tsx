import LogoutButton from "@/features/auth/components/LogoutButton";
import ConversationList from "@/features/conversations/components/ConversationList";
import CreateNewChat from "@/features/conversations/components/CreateNewChat";
import SearchConversationBar from "@/features/conversations/components/SerchConversationBard";
import UserAvatarPhoto from "./UserAvatarPhoto";

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-4 p-4 justify-between h-full w-full bg-gray-100 dark:bg-dark-purple">
      <div className="flex flex-row items-center justify-between pr-2">
        <span className="font-semibold text-gray-800 dark:text-gray-100">Chats</span>
        <div className="flex flex-row gap-4 pr-12 md:pr-0">
          <UserAvatarPhoto />
          <CreateNewChat />
        </div>
      </div>

      <SearchConversationBar />
      <div className="flex flex-col gap-4 overflow-auto h-full">
        <ConversationList />
      </div>
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
