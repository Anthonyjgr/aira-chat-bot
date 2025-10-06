import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import type { ConversationResponse } from "@/types/conversation";
import { useUIStore } from "@/app/store/useUIStore";

interface Props {
  conversation: ConversationResponse;
}

const ConversationItem = ({ conversation }: Props) => {
  const { isDrawerOpen, closeDrawer } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname === `/dashboard/chat/${conversation.id}`;

  const handleClick = () => {
    if (isDrawerOpen) {
      closeDrawer();
    }
    navigate(`/dashboard/chat/${conversation.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all duration-200
        ${
          isActive
            ? "bg-primary shadow-sm"
            : "bg-white dark:bg-violet-200 hover:bg-primary/10 dark:hover:bg-white"
        }`}
      aria-label={`Open conversation: ${conversation.title}`}
    >
      {/* Icon avatar */}
      <div
        className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full transition-colors
          ${isActive ? "bg-white" : "bg-primary/10"}`}
      >
        <MessageSquare className="text-primary" size={20} aria-hidden="true" />
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium truncate ${isActive ? "text-white" : "text-gray-800"}`}
        >
          {conversation.title}
        </p>
        <p className={`text-sm truncate ${isActive ? "text-white/80" : "text-gray-500"}`}>
          {conversation.last_message || "No messages yet"}
        </p>
      </div>
    </button>
  );
};

export default ConversationItem;
