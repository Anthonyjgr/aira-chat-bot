import LogoutButton from "@/features/auth/components/LogoutButton";
import ConversationList from "@/features/conversations/components/ConversationList";
import CreateNewChat from "@/features/conversations/components/CreateNewChat";
import SearchConversationBar from "@/features/conversations/components/SerchConversationBard";

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-4 p-4 justify-between h-full">
      <div className="flex flex-col gap-4">
        {/* HEADER */}
        <div className="flex flex-row justify-between">
          <span>Chats</span>
          <CreateNewChat />
        </div>
        {/* SEARCHABR */}
        <SearchConversationBar />
        {/* CONVERSATIONS LIST */}
        <ConversationList />
      </div>
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
