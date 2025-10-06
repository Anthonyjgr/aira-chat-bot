import { mockApi } from "@/lib/mockApi/mock_API";
import { useConversationStore } from "@/features/conversations/store/conversation.store";
import { useMessageStore } from "@/features/chat/store/messages.store";
import type { Message } from "@/types/conversation";

export const useAIResponse = (convId: number, token: string) => {
  const { addMessage, setMessages } = useMessageStore();
  const { updateConversationInStore } = useConversationStore();

  const requestAIResponse = async (lastUserMessage: string, title: string) => {
    try {
      const { message: aiMsg } = await mockApi.simulateAIResponse(
        convId,
        lastUserMessage
      );

      const current = useMessageStore.getState().messagesByConversation[convId] || [];
      const cleaned = current.filter((m) => !m.isError);
      setMessages(convId, cleaned);
      addMessage(convId, aiMsg);

      updateConversationInStore({
        id: convId,
        last_message: aiMsg.content,
        updated_at: new Date().toISOString(),
        message_count: cleaned.length + 1,
      });
    } catch (err) {
      console.warn("AI response failed:", err);

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
