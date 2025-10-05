import React from "react";
import { RotateCcw } from "lucide-react";
import type { Message } from "@/types/conversation";

interface MessageItemProps {
  message: Message;
  isUser: boolean;
}

const MessageItem = ({ message, isUser }: MessageItemProps) => {
  const isError = message.isError;

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}
      aria-live="polite"
    >
      <div
        className={`rounded-lg px-4 py-2 max-w-[70%] ${
          isError
            ? "bg-red-100 text-red-700 border border-red-300"
            : isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-900"
        }`}
      >
        <p>{message.content}</p>

        {isError && message.retryCallback && (
          <div>
            <button
              onClick={message.retryCallback}
              className="mt-2 flex items-center gap-1 text-sm text-red-700 hover:text-red-800"
            >
              <RotateCcw size={14} /> Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
