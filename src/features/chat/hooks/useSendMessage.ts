import { useState } from "react";
import { mockApi, mockHelpers } from "@/lib/mockApi/mock_API";
import { useAIResponse } from "@/features/conversations/hooks/useAIResponse";
import { useMessageStore } from "@/features/chat/store/messages.store";
import { useConversationStore } from "@/features/conversations/store/conversation.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { Message } from "@/types/conversation";


//  * useSendMessage
//  * ---------------
//  * Handles the full message sending flow:
//  * 1. Save user message locally (optimistic UI)
//  * 2. Persist it to the backend (mock API)
//  * 3. Update conversation metadata
//  * 4. Trigger the AI response via `useAIResponse`
//  * 5. Handles loading states via `isTyping`
//  */


export const useSendMessage = (convId: number, token?: string) => {
  const [isTyping, setIsTyping] = useState(false);
  const { addMessage } = useMessageStore();
  const { updateConversationInStore } = useConversationStore();
  const { user } = useAuthStore();
  const { requestAIResponse } = useAIResponse(convId, token || "");

  // Normal send flow
  const handleSendMessage = async (content: string, existingMessages: Message[]) => {
    if (!convId || !token) return;

    const isFirstMessage = existingMessages.length === 0;
    const title = isFirstMessage
      ? mockHelpers.generateTitle(content)
      : existingMessages[0]?.conversation_id.toString() ?? "Untitled";

    const userMsg: Message = {
      id: Date.now(),
      conversation_id: convId,
      content,
      is_from_ai: false,
      created_at: new Date().toISOString(),
    };
    addMessage(convId, userMsg);

    updateConversationInStore({
      id: convId,
      user_id: user?.id ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_message: content,
      message_count: existingMessages.length + 1,
    });

    try {
      await mockApi.sendMessage(token, convId, content);
      await mockApi.updateConversation(token, convId, { last_message: content });
    } catch (err) {
      console.error("Failed to send message:", err);
    }

    // ✅ Show typing before AI response
    setIsTyping(true);
    await requestAIResponse(content, title);
    setIsTyping(false);
  };

  // Retry flow
  const handleRetry = async (msg: Message) => {
    setIsTyping(true);
    const cleaned = (
      useMessageStore.getState().messagesByConversation[convId] || []
    ).filter((m) => !m.isError);

    useMessageStore.getState().setMessages(convId, cleaned);
    await requestAIResponse(msg.content, "Retry after failure");
    setIsTyping(false);
  };

  return { handleSendMessage, handleRetry, isTyping };
};
