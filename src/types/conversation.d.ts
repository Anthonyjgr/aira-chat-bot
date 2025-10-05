export interface Message {
  id: number;
  conversation_id: number;
  content: string;
  is_from_ai: boolean;
  created_at: string;
  isError?: boolean; // 🔹 Nuevo flag opcional para errores IA
  retryCallback?: () => Promise<void>; // 🔹 Permite reintentar si el mensaje es de error
}

export interface ConversationResponse {
  id: number;
  title: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  last_message: string | null;
  message_count: number;
}

export interface GetConversationsResponse {
  conversations: ConversationResponse[];
}

export interface CreateConversationResponse {
  conversation: ConversationsResponse;
}

export interface GetMessagesResponse {
  messages: Message[];
}

export interface SendMessageResponse {
  message: Message;
}

interface ConversationState {
  conversations: ConversationResponse[];
  isLoading: boolean;
  error: string | null;

  fetchConversations: (token: string) => Promise<void>;
}
