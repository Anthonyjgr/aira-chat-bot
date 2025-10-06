import { RotateCcw } from "lucide-react";
import type { Message } from "@/types/conversation";
import { useEffect, useState } from "react";

interface MessageItemProps {
  message: Message;
  isUser: boolean;
  onRetry?: (message: Message) => void;
}

const MessageItem = ({ message, isUser, onRetry }: MessageItemProps) => {
  const [isError, setIsError] = useState<boolean>(false);
  // console.log(message);

  useEffect(() => {
    setIsError(!!message.isError);
  }, [message]);

  return (
    <div
      className={`flex ${isUser ? "justify-end " : "justify-start"} mb-2`}
      aria-live="polite"
    >
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] xl:max-w-[70%] ${
          isError
            ? "bg-white border border-red-500 dark:bg-gray-200 text-red-700"
            : isUser
            ? "bg-primary text-white"
            : "bg-violet-300 text-gray-900"
        }`}
      >
        <p>{message.content}</p>

        {/* {isError && message.retryCallback  && (
          <div>
            <button
              className="mt-2 flex items-center gap-1 text-sm text-red-700 hover:text-black cursor-pointer"
              onClick={message.retryCallback}
            >
              <RotateCcw size={14} /> Retry
            </button>
          </div>
        )} */}
        {isError && onRetry && (
          <button
            className="mt-2 flex items-center gap-1 text-sm text-red-700 hover:text-black cursor-pointer"
            onClick={() => onRetry(message)}
          >
            <RotateCcw size={14} /> Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
