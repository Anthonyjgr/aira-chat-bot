// ConversationList.tsx
import { useEffect } from "react";
import { useConversationStore } from "../store/conversation.store";
import ConversationItem from "./ConversationItem";
import { useAuthStore } from "@/features/auth/store/auth.store";

const ConversationList = () => {
  const { tokens } = useAuthStore();
  const {
    conversations,
    fetchConversations,
    isLoading,
    error,
    searchQuery,
  } = useConversationStore();

  useEffect(() => {
    if (tokens?.token) fetchConversations(tokens.token);
  }, [tokens?.token]);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading conversations...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  // 🔎 Filtro dinámico
  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredConversations.length === 0) {
    return <p className="text-sm text-gray-400 mt-4">No conversations found.</p>;
  }

  return (
    <div className="flex flex-col gap-2 mt-2 items-start overflow-y-auto pr-2">
      {filteredConversations.map((conv) => (
        <ConversationItem key={conv.id} conversation={conv} />
      ))}
    </div>
  );
};

export default ConversationList;
