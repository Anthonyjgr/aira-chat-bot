import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockApi, mockHelpers } from "@/lib/mockApi/mock_API";
import type { Message } from "@/types/conversation";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useMessageStore } from "@/features/chat/store/messages.store";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { useConversationStore } from "@/features/conversations/store/conversation.store";

const Chat = () => {
  const { conversationId } = useParams();
  const { tokens, user } = useAuthStore();
  const { updateConversationInStore } = useConversationStore();
  const { messagesByConversation, setMessages, addMessage } = useMessageStore();
  const [loading, setLoading] = useState(true);
  const [isTyping, setisTyping] = useState(false);

  const navigate = useNavigate();
  const convId = Number(conversationId);
  const messages = conversationId ? messagesByConversation[convId] || [] : [];

  // 🚨 Si no hay conversationId, redirigimos
  useEffect(() => {
    if (!conversationId) navigate("/dashboard", { replace: true });
  }, [conversationId, navigate]);

  // 📨 Cargar mensajes iniciales (solo si no hay cache) — con guardia anti-race
  useEffect(() => {
    let isCancelled = false;
    if (!conversationId || !tokens) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await mockApi.getMessages(tokens.token, convId);
        if (isCancelled) return;

        // ⛔️ Guardia anti-race:
        // Si YA hay mensajes locales (pudimos haber agregado el del usuario),
        // NO sobrescribimos con lo que venga del API.
        const latestLocal =
          useMessageStore.getState().messagesByConversation[convId] || [];
        if (latestLocal.length === 0) {
          setMessages(convId, res.messages);
        }
      } catch (err) {
        if (!isCancelled) console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    if (!messages.length) fetchMessages();
    else setLoading(false);

    return () => {
      isCancelled = true;
    };
  }, [conversationId, tokens]);

  // 💬 Pedir respuesta de IA (sin borrar mensajes del usuario)
  const requestAIResponse = async (lastUserMessage: string, title: string) => {
    setisTyping(true);
    try {
      const { message: aiMsg } = await mockApi.simulateAIResponse(
        convId,
        lastUserMessage
      );

      // 🧹 Eliminar SOLO la card de error (si existe), mantener resto del historial
      const current = useMessageStore.getState().messagesByConversation[convId] || [];
      const cleaned = current.filter((m) => !m.isError);
      setMessages(convId, cleaned);

      // ➕ Agregar la respuesta de la IA
      addMessage(convId, aiMsg);

      // 🔄 Actualizar conversación (store + API)
      updateConversationInStore({
        id: convId,
        last_message: aiMsg.content,
        updated_at: new Date().toISOString(),
        message_count: cleaned.length + 1,
      });

      await mockApi.updateConversation(tokens!.token, convId, {
        last_message: aiMsg.content,
      });
    } catch (err) {
      console.warn("AI response failed:", err);

      // Evitar duplicar card de error
      const hasErrorCard = (
        useMessageStore.getState().messagesByConversation[convId] || []
      ).some((m) => m.isError);
      if (hasErrorCard) {
        setisTyping(false);
        return;
      }

      const retryFn = async () => {
        // Antes de reintentar, limpiar la card de error actual
        const current = useMessageStore.getState().messagesByConversation[convId] || [];
        const cleaned = current.filter((m) => !m.isError);
        setMessages(convId, cleaned);
        await requestAIResponse(lastUserMessage, title);
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

      addMessage(convId, errorMsg);
    } finally {
      setisTyping(false);
    }
  };

  // ✉️ Enviar mensaje de usuario (siempre se guarda)
  const handleSendMessage = async (content: string) => {
    if (!conversationId || !tokens) return;

    const isFirstMessage = messages.length === 0;
    const title = isFirstMessage
      ? mockHelpers.generateTitle(content)
      : messages[0]?.conversation_id.toString() ?? "Untitled";

    // 💾 Guardar mensaje del usuario inmediatamente
    const userMsg: Message = {
      id: Date.now(),
      conversation_id: convId,
      content,
      is_from_ai: false,
      created_at: new Date().toISOString(),
    };
    addMessage(convId, userMsg);

    // 🧩 Optimistic update de la conversación
    updateConversationInStore({
      id: convId,
      user_id: user?.id ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_message: content,
      message_count:
        useMessageStore.getState().messagesByConversation[convId]?.length || 0,
    });

    // 🧠 Enviar mensaje al mock API (si falla, igual quedó guardado localmente)
    try {
      await mockApi.sendMessage(tokens.token, convId, content);

      const updatePayload = isFirstMessage
        ? { title, last_message: content }
        : { last_message: content };

      const { conversation: updatedConv } = await mockApi.updateConversation(
        tokens.token,
        convId,
        updatePayload
      );

      if (isFirstMessage && updatedConv.title) {
        updateConversationInStore(updatedConv);
      } else {
        updateConversationInStore({
          id: convId,
          last_message: updatedConv.last_message,
          updated_at: updatedConv.updated_at,
        });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      // no hacemos rollback: el mensaje del usuario se queda
    }

    // 🚀 Pedir respuesta de IA (si falla, aparece UNA sola card de error)
    await requestAIResponse(content, title);
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
    <div className="flex flex-col h-full w-full justify-between relative pt-4 md:pt-none">
      <MessageList messages={messages} isTyping={isTyping} />
      <MessageInput onMessageSent={handleSendMessage} isTyping={isTyping} />
    </div>
  );
};

export default Chat;
