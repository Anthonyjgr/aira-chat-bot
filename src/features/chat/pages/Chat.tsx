import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockApi, mockHelpers } from "@/lib/mockApi/mock_API";
import type { Message } from "@/types/conversation";
import { useAuthStore } from "@/features/auth/store/auth.store";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { useConversationStore } from "@/features/conversations/store/conversation.store";

const Chat = () => {
  const { conversationId } = useParams();
  const { tokens, user } = useAuthStore();
  const { updateConversationInStore } = useConversationStore();
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

    const convId = Number(conversationId);
    const isFirstMessage = messages.length === 0;

    const title = isFirstMessage
      ? mockHelpers.generateTitle(content)
      : messages[0]?.conversation_id.toString() ?? "Untitled";

    // 🚀 Optimistic update (antes del request real)
    updateConversationInStore({
      id: convId,
      // title,
      user_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_message: content,
      message_count: messages.length + 1,
    });

    try {
      // 1️⃣ Enviar mensaje del usuario
      const { message: userMsg } = await mockApi.sendMessage(
        tokens.token,
        convId,
        content
      );
      setMessages((prev) => [...prev, userMsg]);
      setisTyping(true);

      // 2️⃣ Actualizar conversación en API (solo título si es primera vez)
      const updatePayload = isFirstMessage
        ? { title, last_message: content }
        : { last_message: content };

      try {
        const { conversation: updatedConv } = await mockApi.updateConversation(
          tokens.token,
          convId,
          updatePayload
        );

        // ✅ Si era el primer mensaje, actualizamos el store con el título generado
        if (isFirstMessage && updatedConv.title) {
          updateConversationInStore(updatedConv);
        } else {
          // ✅ Si no, solo actualizamos el last_message
          updateConversationInStore({
            id: convId,
            last_message: updatedConv.last_message,
            updated_at: updatedConv.updated_at,
          });
        }
      } catch (updateErr) {
        console.warn("⚠️ Optimistic update failed:", updateErr);
      }

      // 3️⃣ Simular respuesta IA
      const { message: aiMsg } = await mockApi.simulateAIResponse(convId, content);
      setMessages((prev) => [...prev, aiMsg]);
      setisTyping(false);

      // 4️⃣ Actualización optimista inmediata del último mensaje (IA)
      updateConversationInStore({
        id: convId,
        user_id: user?.id ?? 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message: aiMsg.content,
        message_count: messages.length + 2,
      });

      // 5️⃣ Actualización real del last_message (confirmación final)
      try {
        await mockApi.updateConversation(tokens.token, convId, {
          last_message: aiMsg.content,
        });
      } catch (updateErr) {
        console.warn("⚠️ Update failed after AI:", updateErr);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setisTyping(false);

      if (err instanceof Error && err.message === "AI service temporarily unavailable") {
        const retryFn = async () => {
          setisTyping(true);
          try {
            const { message: aiMsg } = await mockApi.simulateAIResponse(convId, content);
            setMessages((prev) => prev.filter((m) => !m.isError));
            setMessages((prev) => [...prev, aiMsg]);

            // actualizar last_message optimistamente en retry
            updateConversationInStore({
              id: convId,
              title,
              user_id: user?.id ?? 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_message: aiMsg.content,
              message_count: messages.length + 2,
            });

            await mockApi.updateConversation(tokens.token, convId, {
              last_message: aiMsg.content,
            });
          } catch (retryErr) {
            console.error("Retry failed:", retryErr);
          } finally {
            setisTyping(false);
          }
        };

        const errorMsg: Message = {
          id: Date.now(),
          conversation_id: convId,
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

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full justify-between">
        <div className="flex items-center justify-center h-full">
          <p className="p-4 text-gray-400 text-center">Loading messages…</p>
        </div>
        <MessageInput onMessageSent={handleSendMessage} isTyping={isTyping} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full justify-between">
      <MessageList messages={messages} isTyping={isTyping} />
      <MessageInput onMessageSent={handleSendMessage} isTyping={isTyping} />
    </div>
  );
};

export default Chat;
