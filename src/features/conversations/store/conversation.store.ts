import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApi } from "@/lib/mockApi/mock_API";
import type { ConversationState } from "@/types/conversation";
import { toast } from "react-toastify";

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: [],
      isLoading: false,
      error: null,
      searchQuery: "", // 🔹 nuevo estado

      fetchConversations: async (token: string) => {
        // const current = get().conversations;
        // if (current.length > 0) {
        //   console.log("✅ Skipping fetch, using persisted conversations");
        //   return; 
        // }

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

      setSearchQuery: (query: string) => set({ searchQuery: query }),

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
    {
      name: "aira-conversations-storage",
      partialize: (state) => ({
        conversations: state.conversations,
      }),

      version: 1,
    }
  )
);
