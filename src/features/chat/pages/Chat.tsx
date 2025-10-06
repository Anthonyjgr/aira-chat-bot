import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockApi } from "@/lib/mockApi/mock_API";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useMessageStore } from "@/features/chat/store/messages.store";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { useSendMessage } from "../hooks/useSendMessage";

const Chat = () => {
  const { conversationId } = useParams();
  const { tokens } = useAuthStore();
  const { messagesByConversation, setMessages , error} = useMessageStore();
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

  // Cargar mensajes iniciales (solo si no hay cache) — con guardia anti-race
  // useEffect(() => {
  //   let isCancelled = false;
  //   if (!conversationId || !tokens) return;

  //   const fetchMessages = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await mockApi.getMessages(tokens.token, convId);
  //       if (isCancelled) return;

  //       // Guardia anti-race:
  //       // Si YA hay mensajes locales (pudimos haber agregado el del usuario),
  //       // NO sobrescribimos con lo que venga del API.
  //       const latestLocal =
  //         useMessageStore.getState().messagesByConversation[convId] || [];
  //       if (latestLocal.length === 0) {
  //         setMessages(convId, res.messages);
  //       }
  //     } catch (err) {
  //       if (!isCancelled) console.error(err);
  //     } finally {
  //       if (!isCancelled) setLoading(false);
  //     }
  //   };

  //   if (!messages.length) fetchMessages();
  //   else setLoading(false);

  //   return () => {
  //     isCancelled = true;
  //   };
  // }, [conversationId, tokens]);

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
