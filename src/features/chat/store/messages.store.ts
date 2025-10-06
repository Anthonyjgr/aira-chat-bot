import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApi } from "@/lib/mockApi/mock_API";
import type { MessageState } from "@/types/chat";

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messagesByConversation: {},
      isLoading: false,
      error: null,

      fetchMessages: async (token, conversationId) => {
        set({ isLoading: true, error: null });
        try {
          const { messages } = await mockApi.getMessages(token, conversationId);
          const current = get().messagesByConversation;
          set({
            messagesByConversation: {
              ...current,
              [conversationId]: messages,
            },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to fetch messages";
          set({ error: message });
        } finally {
          set({ isLoading: false });
        }
      },

      addMessage: (conversationId, message) => {
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: [
              ...(state.messagesByConversation[conversationId] || []),
              message,
            ],
          },
        }));
      },

      setMessages: (conversationId, messages) => {
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: messages,
          },
        }));
      },

      clearMessages: (conversationId) => {
        set((state) => {
          const updated = { ...state.messagesByConversation };
          delete updated[conversationId];
          return { messagesByConversation: updated };
        });
      },
    }),
    {
      name: "aira-messages-storage",
      partialize: (state) => ({
        messagesByConversation: state.messagesByConversation,
      }),
    }
  )
);
