import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockApi } from "@/lib/mockApi/mock_API";
import type { Message } from "@/types/conversation";
import { useAuthStore } from "@/features/auth/store/auth.store";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

const Chat = () => {
  const { conversationId } = useParams();
  const { tokens } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setisTyping] = useState(false);

  const navigate = useNavigate();

  // 🚨 Si no hay conversationId, redirigimos de inmediato
  useEffect(() => {
    if (!conversationId) {
      navigate("/dashboard", { replace: true });
    }
  }, [conversationId, navigate]);

  // Cargar mensajes iniciales
  useEffect(() => {
    let isCancelled = false; // bandera local

    const fetchMessages = async () => {
      if (!conversationId || !tokens) return;
      setLoading(true); // importante: reiniciamos el estado
      try {
        const res = await mockApi.getMessages(tokens.token, Number(conversationId));
        if (!isCancelled) setMessages(res.messages); // solo si sigue activo
      } catch (err) {
        if (!isCancelled) console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchMessages();

    // cleanup que cancela el fetch anterior
    return () => {
      isCancelled = true;
    };
  }, [conversationId, tokens]);

  // Enviar mensaje y manejar IA + reintentos
  const handleSendMessage = async (content: string) => {
    if (!conversationId || !tokens) return;

    try {
      // Mensaje del usuario
      const { message: userMsg } = await mockApi.sendMessage(
        tokens.token,
        Number(conversationId),
        content
      );
      setMessages((prev) => [...prev, userMsg]);
      setisTyping(true);

      // Simular respuesta IA
      const { message: aiMsg } = await mockApi.simulateAIResponse(
        Number(conversationId),
        content
      );
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Error sending message:", err);

      // 🧩 detenemos la animación si la IA falla
      setisTyping(false);

      if (err instanceof Error && err.message === "AI service temporarily unavailable") {
        const retryFn = async () => {
          setisTyping(true);
          try {
            const { message: aiMsg } = await mockApi.simulateAIResponse(
              Number(conversationId),
              content
            );
            setMessages((prev) => prev.filter((m) => !m.isError)); // limpiar mensaje de error
            setMessages((prev) => [...prev, aiMsg]);
          } catch (retryErr) {
            console.error("Retry failed:", retryErr);
          } finally {
            setisTyping(false);
          }
        };

        const errorMsg: Message = {
          id: Date.now(),
          conversation_id: Number(conversationId),
          content: "AI service temporarily unavailable. Please try again.",
          is_from_ai: true,
          created_at: new Date().toISOString(),
          isError: true,
          retryCallback: retryFn,
        };

        setMessages((prev) => [...prev, errorMsg]);
      }
    } finally {
      setisTyping(false);
    }
  };

  if (loading) return <p className="p-4 text-gray-400">Loading messages…</p>;

  return (
    <div className="flex flex-col h-full w-full justify-between">
      <MessageList messages={messages} isTyping={isTyping} />
      <MessageInput onMessageSent={handleSendMessage} isTyping={isTyping} />
    </div>
  );
};

export default Chat;
