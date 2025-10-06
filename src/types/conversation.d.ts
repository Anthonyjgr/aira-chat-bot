export interface Message {
  id: number;
  conversation_id: number;
  content: string;
  is_from_ai: boolean;
  created_at: string;
  isPending?: boolean;
  isError?: boolean; // 🔹 Nuevo flag opcional para errores IA
  retryCallback?: () => Promise<void>; // 🔹 Permite reintentar si el mensaje es de error
}

interface MockConversationBase {
  id: number;
  title: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  last_message: string | null;
}

export interface ConversationResponse extends MockConversationBase {
  message_count: number;
}

interface UpdateConversationInput {
  title?: string;
  last_message?: string;
}

interface UpdateConversationResponse {
  conversation: ConversationResponse;
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
  searchQuery: string;

  fetchConversations: (token: string) => Promise<void>;
  createConversation: (
    token: string,
    title?: string
  ) => Promise<ConversationResponse | null>;
  updateConversationInStore: (updatedConv: Partial<ConversationResponse>) => void;
  setSearchQuery: (query: string) => void;
}
