import { create } from "zustand";
import { mockApi } from "@/lib/mockApi/mock_API";
import type { ConversationState } from "@/types/conversation";

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  isLoading: false,
  error: null,

  fetchConversations: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const { conversations } = await mockApi.getConversations(token);
      set({ conversations });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load conversations";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

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



}));
