import { create } from "zustand";
import { mockApi } from "@/lib/mockApi/mock_API";
import type { ConversationState } from "@/types/conversation";

export const useConversationStore = create<ConversationState>((set) => ({
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
}));
