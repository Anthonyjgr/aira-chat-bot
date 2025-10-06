import { useConversationStore } from "../store/conversation.store";
import { useAuthStore } from "@/features/auth/store/auth.store";


const RetryFetchConversations = () => {
  const { tokens } = useAuthStore();
  const { fetchConversations, isLoading } = useConversationStore();

  const handleRetry = () => {
    if (tokens?.token) fetchConversations(tokens.token);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleRetry}
        disabled={isLoading}
        className="w-full py-2 px-4 rounded-lg bg-primary text-white hover:bg-primary/80 transition disabled:opacity-50"
      >
        {isLoading ? "Retrying..." : "Retry Fetch Conversations"}
      </button>
    </div>
  );
};

export default RetryFetchConversations;
