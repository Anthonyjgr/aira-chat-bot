// src/features/chat/components/MessageInput.tsx
import React, { useState } from "react";
import { SendHorizontal } from "lucide-react";

interface MessageInputProps {
  onMessageSent: (content: string) => Promise<void>;
  isTyping?: boolean;
}

const MessageInput = ({ onMessageSent, isTyping = false }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessage("");
    await onMessageSent(message.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-gray-400 dark:border-primary/60 h-[40px] "
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border border-gray-400 dark:border-primary/60 rounded-full px-4 py-2 mt-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        disabled={isTyping}
      />

      <button
        type="submit"
        disabled={isTyping || !message.trim()}
        className={`p-2 rounded-full transition duration-300 flex mt-6 items-center justify-center ${
          isTyping || !message.trim()
            ? "cursor-not-allowed"
            : "bg-primary hover:bg-secundary text-white"
        }`}
        aria-label="Send message"
      >
        <SendHorizontal className="w-5 h-5 p-[1px] ml-[1.5px]" />
      </button>
    </form>
  );
};

export default MessageInput;
