import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApi } from "@/lib/mockApi/mock_API";
import type { MessageState } from "@/types/chat";

/**
 * useMessageStore
 * ------------------
 * Zustand store for managing chat messages grouped by conversation.
 *
 * Features:
 * - Fetch messages for a specific conversation from the mock API
 * - Add, replace, or clear messages locally
 * - Persistent message state across reloads
 * - Scoped error and loading indicators
 *
 * Design Considerations:
 * - The store is **conversation-scoped** (messages are stored under each conversation ID).
 * - Persistence is limited to `messagesByConversation` to reduce unnecessary localStorage bloat.
 * - All actions are **atomic** (each state update is isolated and immutable).
 * - Designed for both optimistic UI and graceful fallback on API failures.
 */

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messagesByConversation: {}, // Object: { [conversationId]: Message[] }
      isLoading: false, // Global loading indicator for message fetches
      error: null, // Holds error message from API failures

      // --------------------------------------
      // 🔸 Async Actions
      // --------------------------------------

      /**
       * fetchMessages
       * Fetches all messages for a specific conversation from the API.
       *
       * @param token - Authentication token for the API call
       * @param conversationId - ID of the conversation whose messages are to be fetched
       *
       * On success:
       * - Merges fetched messages into `messagesByConversation`
       * - Resets any previous error state
       *
       * On failure:
       * - Captures and stores the error message
       * - Leaves existing cached messages intact
       */

      fetchMessages: async (token, conversationId) => {
        set({ isLoading: true, error: null });
        try {
          const { messages } = await mockApi.getMessages(token, conversationId);
          const current = get().messagesByConversation;
          // Merge fetched messages while preserving other conversation data
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

      // --------------------------------------
      // Local Message Mutations
      // --------------------------------------

      /**
       * addMessage
       * Appends a new message to the existing list for a given conversation.
       *
       * @param conversationId - Target conversation ID
       * @param message - Message object to be added
       *
       * Used for optimistic UI updates (e.g., immediately showing a new user message).
       */

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

      /**
       * setMessages
       * Replaces all messages for a given conversation.
       *
       * @param conversationId - Target conversation ID
       * @param messages - New list of messages to set
       *
       * Typically used after fetching from the API or cleaning error states.
       */

      setMessages: (conversationId, messages) => {
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: messages,
          },
        }));
      },

      /**
       * clearMessages
       * Deletes all messages associated with a given conversation ID.
       *
       * Useful when deleting a conversation or logging out.
       */
      clearMessages: (conversationId) => {
        set((state) => {
          const updated = { ...state.messagesByConversation };
          delete updated[conversationId];
          return { messagesByConversation: updated };
        });
      },
    }),

    // --------------------------------------
    // Persistence Configuration
    // --------------------------------------
    {
      name: "aira-messages-storage",
      /**
       * Only persist the actual message data.
       * Avoid persisting transient flags like isLoading or error.
       */
      partialize: (state) => ({
        messagesByConversation: state.messagesByConversation,
      }),
    }
  )
);
