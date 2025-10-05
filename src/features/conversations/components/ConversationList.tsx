import { useEffect } from "react";
import { useConversationStore } from "../store/conversation.store";
import ConversationItem from "./ConversationItem";
import { useAuthStore } from "@/features/auth/store/auth.store";

const ConversationList = () => {
  const { tokens } = useAuthStore();
  const { conversations, fetchConversations, isLoading, error } = useConversationStore();

  useEffect(() => {
    if (tokens?.token) {
      fetchConversations(tokens.token);
    }
  }, [tokens?.token, fetchConversations]);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading conversations...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (conversations.length === 0) {
    return <p className="text-sm text-gray-400 mt-4">No conversations found.</p>;
  }

  return (
    <div className="flex flex-col gap-2 mt-2 items-start">
      {conversations.map((conv) => (
        <ConversationItem key={conv.id} conversation={conv} />
      ))}
    </div>
  );
};

export default ConversationList;
