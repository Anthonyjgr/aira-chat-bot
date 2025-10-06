import { useState } from "react";
import { mockApi, mockHelpers } from "@/lib/mockApi/mock_API";
import { useAIResponse } from "@/features/conversations/hooks/useAIResponse";
import { useMessageStore } from "@/features/chat/store/messages.store";
import { useConversationStore } from "@/features/conversations/store/conversation.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { Message } from "@/types/conversation";

/**
 * useSendMessage
 * ----------------
 * Custom hook responsible for orchestrating the entire message sending workflow.
 *
 * Responsibilities:
 * 1. Add the user's message locally for an instant (optimistic) UI update.
 * 2. Persist the message to the backend using the mock API.
 * 3. Update conversation metadata such as `last_message` and timestamps.
 * 4. Trigger the AI-generated response through the `useAIResponse` hook.
 * 5. Manage the typing/loading state (`isTyping`) for a smooth user experience.
 *
 * Design Rationale:
 * - Keeps the Chat component minimal by encapsulating side effects and API coordination logic.
 * - Decouples message creation, persistence, and AI response handling.
 * - Uses local optimistic updates to maintain responsiveness even under API latency.
 */

export const useSendMessage = (convId: number, token?: string) => {
  const [isTyping, setIsTyping] = useState(false);
  // Access to domain stores (state and actions)
  const { addMessage } = useMessageStore();
  const { updateConversationInStore } = useConversationStore();
  const { user } = useAuthStore();
  const { requestAIResponse } = useAIResponse(convId, token || "");

  /**
   * handleSendMessage
   * ------------------
   * Main handler for sending a new user message within a conversation.
   *
   * Flow:
   * 1. Generates a conversation title if this is the first message.
   * 2. Adds the message locally to the message store.
   * 3. Updates the conversation metadata optimistically.
   * 4. Persists the message and conversation update to the mock API.
   * 5. Triggers the AI response simulation and manages the typing state.
   *
   * @param content - The message text provided by the user.
   * @param existingMessages - Current conversation messages for reference.
   */
  const handleSendMessage = async (content: string, existingMessages: Message[]) => {
    if (!convId || !token) return;

    const isFirstMessage = existingMessages.length === 0;
    const title = isFirstMessage
      ? mockHelpers.generateTitle(content)
      : existingMessages[0]?.conversation_id.toString() ?? "Untitled";

    // 1. Optimistically add user message to the store
    const userMsg: Message = {
      id: Date.now(),
      conversation_id: convId,
      content,
      is_from_ai: false,
      created_at: new Date().toISOString(),
    };
    addMessage(convId, userMsg);

    // 2. Update conversation metadata locally
    updateConversationInStore({
      id: convId,
      user_id: user?.id ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_message: content,
      message_count: existingMessages.length + 1,
    });

    // 3. Attempt to persist message and update conversation remotely

    try {
      await mockApi.sendMessage(token, convId, content);
      await mockApi.updateConversation(token, convId, { last_message: content });
    } catch (err) {
      console.error("Failed to send message:", err);
      // The user message remains locally; no rollback is performed
    }

    // 4. Manage AI typing and simulate response
    setIsTyping(true);
    await requestAIResponse(content, title);
    setIsTyping(false);
  };

  /**
   * handleRetry
   * ------------
   * Used when an AI message fails to generate (e.g., network error or mock failure).
   * Cleans up the error message card and retries the AI response.
   *
   * @param msg - The original failed message to retry.
   */
  const handleRetry = async (msg: Message) => {
    setIsTyping(true);
    // Remove any existing error message cards before retrying
    const cleaned = (
      useMessageStore.getState().messagesByConversation[convId] || []
    ).filter((m) => !m.isError);

    useMessageStore.getState().setMessages(convId, cleaned);
    // Reattempt AI response generation
    await requestAIResponse(msg.content, "Retry after failure");
    setIsTyping(false);
  };

  return { handleSendMessage, handleRetry, isTyping };
};
