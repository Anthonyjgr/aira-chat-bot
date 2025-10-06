import { useAuthStore } from "@/features/auth/store/auth.store";
import { useMessageStore } from "../store/messages.store";

interface RetryFetchMessagesProps {
  conversationId: number;
}

const RetryFetchMessages = ({ conversationId }: RetryFetchMessagesProps) => {
  const { tokens } = useAuthStore();
  const { fetchMessages, isLoading } = useMessageStore();

  const handleRetry = () => {
    if (tokens?.token) fetchMessages(tokens.token, conversationId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-purple rounded-2xl shadow-xl w-[90%] max-w-md p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Server Error
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We couldn’t load your messages. Please try again.
        </p>
        <button
          onClick={handleRetry}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-lg bg-primary text-white hover:bg-primary/80 transition disabled:opacity-50"
        >
          {isLoading ? "Retrying..." : "Retry Fetch Messages"}
        </button>
      </div>
    </div>
  );
};

export default RetryFetchMessages;

