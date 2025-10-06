import { useEffect } from "react";
import { useConversationStore } from "../store/conversation.store";
import ConversationItem from "./ConversationItem";
import { useAuthStore } from "@/features/auth/store/auth.store";
import RetryFetchConversations from "./RetryFetchConversations";
import { motion, AnimatePresence } from "framer-motion";

const ConversationList = () => {
  const { tokens } = useAuthStore();
  const { conversations, fetchConversations, isLoading, error, searchQuery } =
    useConversationStore();

  useEffect(() => {
    if (tokens?.token) fetchConversations(tokens.token);
  }, [tokens?.token, fetchConversations]);

  if (isLoading) {
    return (
      <p className="text-sm text-gray-500 bg-white dark:bg-dark-purple">
        Loading conversations...
      </p>
    );
  }

  if (error) {
    return <RetryFetchConversations />;
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
      <AnimatePresence mode="popLayout">
        {filteredConversations.map((conv) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            layout
            className="w-full"
          >
            <ConversationItem key={conv.id} conversation={conv} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ConversationList;
