import { SquarePen, Loader2 } from "lucide-react";
import { useConversationStore } from "@/features/conversations/store/conversation.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CreateNewChat = () => {
  const { tokens } = useAuthStore();
  const { createConversation } = useConversationStore();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateChat = async () => {
    if (!tokens?.token || isCreating) return;

    setIsCreating(true);
    try {
      const newConv = await createConversation(tokens.token, "New Conversation");
      if (newConv) {
        navigate(`/dashboard/chat/${newConv.id}`);
      }
    } catch (err) {
      console.error("Error creating chat:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleCreateChat}
      disabled={isCreating}
      className={`cursor-pointer p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center shadow-md h-10 w-10 ${
        isCreating ? "opacity-60 cursor-not-allowed" : ""
      }`}
      aria-label="Create new chat"
    >
      {isCreating ? (
        <Loader2 className="w-4 h-4 text-white animate-spin" />
      ) : (
        <SquarePen size={20} color="white" />
      )}
    </button>
  );
};

export default CreateNewChat;
