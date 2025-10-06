import { mockApi } from "@/lib/mockApi/mock_API";
import { useConversationStore } from "@/features/conversations/store/conversation.store";
import { useMessageStore } from "@/features/chat/store/messages.store";
import type { Message } from "@/types/conversation";

/**
 * useAIResponse
 * --------------
 * Custom hook responsible for handling simulated AI message responses.
 *
 * Responsibilities:
 * 1. Request and append AI-generated responses via the mock API.
 * 2. Remove any existing error messages before adding a new one.
 * 3. Update conversation metadata (last message, timestamps, message count).
 * 4. Gracefully handle API errors and show a retryable error card.
 *
 * Design Rationale:
 * - Keeps the Chat module modular and clean by isolating AI logic.
 * - Uses local optimistic updates for better user experience.
 * - Prevents duplicate error messages for the same failure event.
 *
 * @param convId - The active conversation ID.
 * @param _token - The authentication token (currently unused, reserved for future real API calls).
 * @returns { requestAIResponse } - Function to trigger the AI response simulation.
 */

/**
 * requestAIResponse
 * ------------------
 * Core logic for generating and storing an AI response message.
 * Fetches a mock AI message, removes any previous error states, updates the store,
 * and synchronizes conversation metadata.
 *
 * If the API call fails, it inserts a retryable error message card instead.
 *
 * @param lastUserMessage - The most recent user message text.
 * @param _title - Optional conversation title (unused, placeholder for scalability).
 */
export const useAIResponse = (convId: number, _token: string) => {
  const { addMessage, setMessages } = useMessageStore();
  const { updateConversationInStore } = useConversationStore();

  const requestAIResponse = async (lastUserMessage: string, _title: string) => {
    try {
      // 1. Request simulated AI response from mock API
      const { message: aiMsg } = await mockApi.simulateAIResponse(
        convId,
        lastUserMessage
      );
      // 2. Remove existing error messages to avoid clutter
      const current = useMessageStore.getState().messagesByConversation[convId] || [];
      const cleaned = current.filter((m) => !m.isError);
      setMessages(convId, cleaned);

      // 3. Add AI-generated response
      addMessage(convId, aiMsg);

      // 4. Update conversation metadata for UI synchronization
      updateConversationInStore({
        id: convId,
        last_message: aiMsg.content,
        updated_at: new Date().toISOString(),
        message_count: cleaned.length + 1,
      });
    } catch (err) {
      console.warn("AI response failed:", err);

      // Prevent duplicate error message cards
      const hasErrorCard = (
        useMessageStore.getState().messagesByConversation[convId] || []
      ).some((m) => m.isError);

      if (!hasErrorCard) {
        const errorMsg: Message = {
          id: Date.now(),
          conversation_id: convId,
          content: "AI service temporarily unavailable. Please try again.",
          is_from_ai: true,
          created_at: new Date().toISOString(),
          isError: true,
        };
        addMessage(convId, errorMsg);
      }
    }
  };

  return { requestAIResponse };
};
