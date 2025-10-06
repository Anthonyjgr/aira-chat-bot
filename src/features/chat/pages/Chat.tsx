import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useMessageStore } from "@/features/chat/store/messages.store";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { useSendMessage } from "../hooks/useSendMessage";

const Chat = () => {
  const { conversationId } = useParams();
  const { tokens } = useAuthStore();
  const { messagesByConversation } = useMessageStore();
  const [loading, setLoading] = useState(true);
  const convId = Number(conversationId);

  // ✅ Initialize message + AI send logic
  const { handleSendMessage, handleRetry, isTyping } = useSendMessage(
    convId,
    tokens?.token
  );

  const navigate = useNavigate();
  const messages = conversationId ? messagesByConversation[convId] || [] : [];

  // Si no hay conversationId, redirigimos
  useEffect(() => {
    if (!conversationId) navigate("/dashboard", { replace: true });
  }, [conversationId, navigate]);


  useEffect(() => {
  if (!conversationId || !tokens) return;

  const loadMessages = async () => {
    setLoading(true);
    try {
      await useMessageStore.getState().fetchMessages(tokens.token, convId);
    } finally {
      setLoading(false);
    }
  };

  loadMessages();
}, [conversationId, tokens]);

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full justify-between">
        <div className="flex items-center justify-center h-full">
          <p className="p-4 text-gray-400 text-center">Loading messages…</p>
        </div>
        {/* <MessageInput onMessageSent={handleSendMessage} isTyping={isTyping} /> */}
        <MessageInput
          onMessageSent={(msg) => handleSendMessage(msg, messages)}
          isTyping={isTyping}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full justify-between relative pt-4 md:pt-none">
      <MessageList messages={messages} isTyping={isTyping} onRetry={handleRetry} conversationId={Number(conversationId)}/>
      {/* <MessageInput onMessageSent={handleSendMessage} isTyping={isTyping} /> */}
      <MessageInput
        onMessageSent={(msg) => handleSendMessage(msg, messages)}
        isTyping={isTyping}
      />
    </div>
  );
};

export default Chat;
