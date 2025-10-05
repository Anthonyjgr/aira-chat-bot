import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import type { ConversationResponse } from "@/types/conversation";

interface Props {
  conversation: ConversationResponse;
}

const ConversationItem = ({ conversation }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dashboard/chat/${conversation.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 w-full p-3 bg-white hover:bg-gray-200 transition rounded-lg text-left"
      aria-label={`Open conversation: ${conversation.title}`}
    >
      {/* Icon avatar */}
      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
        <MessageSquare className="text-blue-600" size={20} aria-hidden="true" />
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0"> 
        <p className="font-medium text-gray-800 truncate">
          {conversation.title}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {conversation.last_message || "No messages yet"}
        </p>
      </div>
    </button>
  );
};

export default ConversationItem;
