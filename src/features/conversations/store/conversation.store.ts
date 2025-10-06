import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApi } from "@/lib/mockApi/mock_API";
import type { ConversationState } from "@/types/conversation";
import { toast } from "react-toastify";

/**
 * 💬 useConversationStore
 * -----------------------
 * Zustand store responsible for managing conversations and related metadata.
 *
 * Features:
 * - Fetch, create, and locally update conversations
 * - Handle search queries and local filtering
 * - Persist conversations for offline or rehydrated sessions
 * - Handle transient loading and error states with proper UI feedback
 *
 * Architectural Notes:
 * - This store forms part of the domain layer for "Conversations" under a DDD-inspired structure.
 * - The API layer (`mockApi`) acts as the persistence boundary for this domain.
 * - All state mutations are atomic and immutable, ensuring predictable UI updates.
 */

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      // --------------------------------------
      // 🔹 Core State
      // --------------------------------------
      conversations: [], // Array of all user conversations
      isLoading: false, // Indicates whether a fetch/create operation is in progress
      error: null, // Holds API or network error messages
      searchQuery: "", // Used for dynamic filtering in the UI

      // --------------------------------------
      //  Fetch Conversations
      // --------------------------------------
      /**
       * Fetches all user conversations from the API.
       *
       * @param token - User authentication token
       *
       * The method:
       * 1. Sets loading state and clears previous errors
       * 2. Fetches conversation data from the mock API
       * 3. Updates the store with the new list
       * 4. Handles API failures gracefully with a toast notification
       */

      fetchConversations: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          const { conversations } = await mockApi.getConversations(token);
          set({ conversations });
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Failed to load conversations";
          set({ error: message });
          toast.error(message, {
            toastId: message,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // --------------------------------------
      //  Search Query Management
      // --------------------------------------
      /**
       * Updates the local search query state for real-time filtering.
       *
       * @param query - The new query string to apply
       */
      setSearchQuery: (query: string) => set({ searchQuery: query }),

      // --------------------------------------
      //  Create Conversation
      // --------------------------------------
      /**
       * Creates a new conversation through the API and appends it to the local store.
       *
       * @param token - User authentication token
       * @param title - Optional conversation title (defaults to "New Conversation")
       *
       * On failure, logs the error and updates store with an error message.
       */

      createConversation: async (token, title = "New Conversation") => {
        try {
          const res = await mockApi.createConversation(token, title);
          const updated = [...get().conversations, res.conversation];
          set({ conversations: updated });
          return res.conversation;
        } catch (err) {
          console.error("Error creating conversation:", err);
          set({ error: "Failed to create conversation" });
          return null;
        }
      },

      // --------------------------------------
      //  Update Existing Conversation (In-Store Only)
      // --------------------------------------
      /**
       *  updateConversationInStore
       * Updates a conversation object **locally** within the store without making an API call.
       *
       * @param updatedConv - Partial or full conversation object containing updated properties.
       *
       * This method performs a **selective merge** of updated fields to avoid overwriting
       * valid existing data with `undefined` or `null`.
       *
       * Implementation Details:
       * - Iterates over all conversations
       * - Finds the matching conversation by `id`
       * - Merges fields only if the new value is not `undefined` or `null`
       *
       * Example:
       * ```ts
       * updateConversationInStore({
       *   id: 12,
       *   last_message: "Hello again!",
       *   updated_at: new Date().toISOString(),
       * });
       * ```
       *
       * Why this approach?
       * ✅ Prevents accidental data loss (e.g., overwriting `title` with `undefined`)
       * ✅ Keeps the update atomic and efficient
       * ✅ Avoids unnecessary full re-fetches from the API
       */

      updateConversationInStore: (updatedConv) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === updatedConv.id
              ? {
                  ...conv,
                  ...Object.fromEntries(
                    Object.entries(updatedConv).filter(
                      ([, value]) => value !== undefined && value !== null
                    )
                  ),
                }
              : conv
          ),
        }));
      },
    }),
    // --------------------------------------
    //  Persistence Configuration
    // --------------------------------------
    {
      name: "aira-conversations-storage", // Key used for localStorage persistence
      /**
       * Only persist essential data (conversations).
       * Transient states (loading, error, etc.) are not persisted.
       */
      partialize: (state) => ({
        conversations: state.conversations,
      }),

      version: 1, // Useful for future migrations
    }
  )
);
