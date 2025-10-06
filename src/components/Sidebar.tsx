import LogoutButton from "@/features/auth/components/LogoutButton";
import ConversationList from "@/features/conversations/components/ConversationList";
import CreateNewChat from "@/features/conversations/components/CreateNewChat";
import SearchConversationBar from "@/features/conversations/components/SerchConversationBard";
import UserAvatarPhoto from "./UserAvatarPhoto";

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-4 p-4 justify-between h-full w-full">
      <div className="flex flex-row items-center justify-between pr-2">
        <span>Chats</span>
        <div className="flex flex-row gap-4">
          <UserAvatarPhoto />
          <CreateNewChat />
        </div>
      </div>
      {/* SEARCHABR */}
      <SearchConversationBar />
      <div className="flex flex-col gap-4 overflow-auto h-full">
        {/* HEADER */}
        {/* CONVERSATIONS LIST */}
        <ConversationList />
      </div>
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
