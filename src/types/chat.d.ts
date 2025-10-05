import type { Message } from "./conversation";

export interface MessageState {
  messagesByConversation: Record<number, Message[]>;
  isLoading: boolean;
  error: string | null;

  fetchMessages: (token: string, conversationId: number) => Promise<void>;
  addMessage: (conversationId: number, message: Message) => void;
  setMessages: (conversationId: number, messages: Message[]) => void;
  clearMessages: (conversationId: number) => void;
}