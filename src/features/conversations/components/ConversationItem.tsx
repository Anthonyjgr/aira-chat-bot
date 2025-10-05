import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import type { ConversationResponse } from "@/types/conversation";

interface Props {
  conversation: ConversationResponse;
}

const ConversationItem = ({ conversation }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname === `/dashboard/chat/${conversation.id}`;


  const handleClick = () => {
    navigate(`/dashboard/chat/${conversation.id}`);
  };

  console.log(conversation.title)

  return (
    <button
      onClick={handleClick}
      className={`relative flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all duration-200
        ${
          isActive
            ? "bg-blue-50 border border-blue-400 shadow-sm"
            : "bg-white hover:bg-gray-100 border border-transparent"
        }`}
      aria-label={`Open conversation: ${conversation.title}`}
    >
      {/* Indicator bar (solo visible si está activa) */}
      {isActive && (
        <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r transition-all duration-200" />
      )}

      {/* Icon avatar */}
      <div
        className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full transition-colors
          ${isActive ? "bg-blue-600" : "bg-blue-100"}`}
      >
        <MessageSquare
          className={`${isActive ? "text-white" : "text-blue-600"}`}
          size={20}
          aria-hidden="true"
        />
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium truncate ${
            isActive ? "text-blue-700" : "text-gray-800"
          }`}
        >
          {conversation.title}
        </p>
        <p className={`text-sm truncate ${isActive ? "text-blue-500" : "text-gray-500"}`}>
          {conversation.last_message || "No messages yet"}
        </p>
      </div>
    </button>
  );
};

export default ConversationItem;
