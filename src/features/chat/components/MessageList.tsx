import MessageItem from "./MessageItem";
import type { Message } from "@/types/conversation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  onRetry?: (message: Message) => void;
}

const MessageList = ({ messages, isTyping , onRetry }: MessageListProps) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Detectar si el usuario hace scroll hacia arriba
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 50; // margen de tolerancia

      setShowScrollButton(!isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll manual al fondo al presionar el botón
  const scrollToBottom = () => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const iaThinkingDefaultMessage = {
    id: 123,
    conversation_id: messages[0]?.conversation_id ?? 0,
    content: "Thinking...",
    is_from_ai: true,
    created_at: "",
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full p-4 overflow-y-auto h-[calc(100vh-120px)]"
    >
      {messages.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          Hello, I'm Aira your AI assintant. What can I help you with?
        </p>
      ) : (
        messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isUser={!msg.is_from_ai && msg.conversation_id === msg.conversation_id}
            onRetry={onRetry}
          />
        ))
      )}
      {isTyping && (
        <div className="animate-thinking">
          <MessageItem
            key="random-id"
            message={iaThinkingDefaultMessage}
            isUser={false}
          />
        </div>
      )}

      {/* marcador invisible para el scroll */}
      <div ref={endOfMessagesRef} />

      {/* botón flotante para volver al último mensaje */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-14 right-0 border bg-primary text-white p-2 rounded-full shadow-lg hover:bg-secundary transition-all"
          aria-label="Scroll to latest message"
        >
          <ChevronDown size={20} />
        </button>
      )}
    </div>
  );
};

export default MessageList;
