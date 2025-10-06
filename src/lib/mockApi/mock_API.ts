// mockApi.js - Archivo que proporcionas a los desarrolladores

import type {
  GetCurrentUserResponse,
  LoginResponse,
  RegisterUserResponse,
  UpdateProfileInput,
  UpdateProfileResponse,
} from "@/types/auth";
import type {
  CreateConversationResponse,
  GetConversationsResponse,
  GetMessagesResponse,
  MockConversationBase,
  SendMessageResponse,
  UpdateConversationInput,
  UpdateConversationResponse,
} from "@/types/conversation";
import type { Message } from "@/types/conversation";

interface MockHelpers {
  getTypingDelay(messageLength: number): number;
  isValidToken(token: unknown): boolean;
  formatDate(dateString: string): string;
  generateTitle(firstMessage: string): string;
}

// ==========================================
// MOCK DATA
// ==========================================

const MOCK_USERS = [
  {
    id: 1,
    email: "demo@example.com",
    name: "Demo User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
  },
  {
    id: 2,
    email: "jane@example.com",
    name: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  },
];

const MOCK_CONVERSATIONS: MockConversationBase[] = [
  {
    id: 1,
    title: "Getting Started with AI",
    user_id: 1,
    created_at: "2025-07-20T10:00:00Z",
    updated_at: "2025-07-25T14:30:00Z",
    last_message: "How can I improve my workflow with AI tools?",
  },
  {
    id: 2,
    title: "Project Planning Discussion",
    user_id: 1,
    created_at: "2025-07-22T09:15:00Z",
    updated_at: "2025-07-25T11:20:00Z",
    last_message: "Let's break down the project into smaller tasks",
  },
  {
    id: 3,
    title: "Technical Questions",
    user_id: 1,
    created_at: "2025-07-24T16:45:00Z",
    updated_at: "2025-07-25T16:45:00Z",
    last_message: "What's the best approach for this problem?",
  },
];

const MOCK_MESSAGES: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      conversation_id: 1,
      content: "Hello! I'm looking to get started with AI tools for my daily workflow.",
      is_from_ai: false,
      created_at: "2025-07-20T10:00:00Z",
    },
    {
      id: 2,
      conversation_id: 1,
      content:
        "That's great! AI tools can significantly boost productivity. What specific areas of your workflow would you like to improve?",
      is_from_ai: true,
      created_at: "2025-07-20T10:00:30Z",
    },
    {
      id: 3,
      conversation_id: 1,
      content: "Mainly content creation and project management.",
      is_from_ai: false,
      created_at: "2025-07-20T10:01:00Z",
    },
    {
      id: 4,
      conversation_id: 1,
      content:
        "Perfect! For content creation, tools like GPT models can help with writing, brainstorming, and editing. For project management, AI can assist with task prioritization, timeline estimation, and resource allocation. Would you like me to elaborate on any of these areas?",
      is_from_ai: true,
      created_at: "2025-07-20T10:01:45Z",
    },
  ],
  2: [
    {
      id: 5,
      conversation_id: 2,
      content: "I have a complex project that needs to be broken down. Can you help?",
      is_from_ai: false,
      created_at: "2025-07-22T09:15:00Z",
    },
    {
      id: 6,
      conversation_id: 2,
      content:
        "Absolutely! I'd be happy to help you break down your project. Could you tell me more about the project's scope and main objectives?",
      is_from_ai: true,
      created_at: "2025-07-22T09:15:30Z",
    },
  ],
  3: [
    {
      id: 7,
      conversation_id: 3,
      content: "What's the best way to handle authentication in a React application?",
      is_from_ai: false,
      created_at: "2025-07-24T16:45:00Z",
    },
    {
      id: 8,
      conversation_id: 3,
      content:
        "Great question! For React authentication, I recommend using JWT tokens with a context provider pattern. Here's a solid approach:\n\n1. Create an AuthContext to manage authentication state\n2. Use protected routes with a PrivateRoute component\n3. Store tokens securely (httpOnly cookies preferred)\n4. Implement token refresh logic\n5. Handle logout and session expiration\n\nWould you like me to elaborate on any of these points?",
      is_from_ai: true,
      created_at: "2025-07-24T16:45:45Z",
    },
  ],
};

// ==========================================
// MOCK API FUNCTIONS
// ==========================================

// Simulate network delay
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulate random failures (10% chance)
const shouldFail = () => Math.random() < 0.1;

export const mockApi = {
  // ==========================================
  // AUTH ENDPOINTS
  // ==========================================

  async login(email: string, password: string): Promise<LoginResponse> {
    await delay(1000);

    if (shouldFail()) {
      throw new Error("Network error occurred");
    }

    const user = MOCK_USERS.find((u) => u.email === email);

    if (!user || password.length < 6) {
      throw new Error("Invalid credentials");
    }

    return {
      user,
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      expires_in: 3600,
    };
  },

  async register(
    email: string,
    _password: string,
    name: string
  ): Promise<RegisterUserResponse> {
    await delay(1200);

    if (shouldFail()) {
      throw new Error("Registration failed");
    }

    if (MOCK_USERS.find((u) => u.email === email)) {
      throw new Error("Email already exists");
    }

    const newUser = {
      id: Date.now(),
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    };

    return {
      user: newUser,
      token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
      expires_in: 3600,
    };
  },

  async getCurrentUser(token: string): Promise<GetCurrentUserResponse> {
    await delay(400);

    if (!token || !token.startsWith("mock-jwt-token")) {
      throw new Error("Invalid token");
    }

    // Extract user ID from token (mock implementation)
    const userId = parseInt(token.split("-")[3]);
    const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

    return { user };
  },

  // ==========================================
  // CONVERSATION ENDPOINTS
  // ==========================================

  async getConversations(token: string): Promise<GetConversationsResponse> {
    await delay(600);


    if (!token) {
      throw new Error("Unauthorized");
    }

    if (shouldFail()) {
      throw new Error("Failed to fetch conversations");
    }

    return {
      conversations: MOCK_CONVERSATIONS.map((conv) => ({
        ...conv,
        message_count: MOCK_MESSAGES[conv.id]?.length || 0,
      })),
    };
  },

  async createConversation(
    token: string,
    title = "New Conversation"
  ): Promise<CreateConversationResponse> {
    await delay(800);

    if (!token) {
      throw new Error("Unauthorized");
    }

    const newConversation = {
      id: Date.now(),
      title,
      user_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_message: null,
      message_count: 0,
    };

    // we also save within local conversations
    MOCK_CONVERSATIONS.push(newConversation);
    return { conversation: newConversation };
  },

  async getMessages(token: String, conversationId: number): Promise<GetMessagesResponse> {
    await delay(500);

    if (!token) {
      throw new Error("Unauthorized");
    }

    if (shouldFail()) {
      throw new Error("Failed to fetch messages");
    }

    const messages = MOCK_MESSAGES[conversationId] || [];

    return {
      messages: messages.map((msg) => ({
        ...msg,
        created_at: new Date(msg.created_at).toISOString(),
      })),
    };
  },

  async sendMessage(
    token: string,
    conversationId: number,
    content: string
  ): Promise<SendMessageResponse> {
    await delay(300);

    if (!token) {
      throw new Error("Unauthorized");
    }

    if (!content.trim()) {
      throw new Error("Message cannot be empty");
    }

    const newMessage = {
      id: Date.now(),
      conversation_id: conversationId,
      content: content.trim(),
      is_from_ai: false,
      created_at: new Date().toISOString(),
    };

    return { message: newMessage };
  },

  async simulateAIResponse(
    conversationId: number,
    userMessage: string
  ): Promise<SendMessageResponse> {
    // Simulate AI "thinking" time
    await delay(2000 + Math.random() * 2000); // 2-4 seconds

    if (shouldFail()) {
      throw new Error("AI service temporarily unavailable");
    }

    // Select contextual response based on user message
    const response = this.getContextualResponse(userMessage);

    const aiMessage = {
      id: Date.now() + 1,
      conversation_id: conversationId,
      content: response,
      is_from_ai: true,
      created_at: new Date().toISOString(),
    };

    return { message: aiMessage };
  },

  getContextualResponse(userMessage: string) {
    const message = userMessage.toLowerCase();

    // Technical questions
    if (
      message.includes("react") ||
      message.includes("javascript") ||
      message.includes("typescript")
    ) {
      const techResponses = [
        "Great question about React! For state management, I'd recommend starting with useState for simple cases and moving to useReducer or external libraries like Zustand for more complex scenarios.",
        "JavaScript is indeed powerful! The key is understanding closures, async/await patterns, and modern ES6+ features. Would you like me to elaborate on any specific concept?",
        "TypeScript adds excellent type safety to JavaScript. Start with basic types, then gradually adopt interfaces, generics, and advanced patterns as you get comfortable.",
      ];
      return techResponses[Math.floor(Math.random() * techResponses.length)];
    }

    // Project/work related
    if (
      message.includes("project") ||
      message.includes("work") ||
      message.includes("plan")
    ) {
      const projectResponses = [
        "For project planning, I suggest breaking it down into smaller, manageable tasks. What's the main goal you're trying to achieve?",
        "Effective project management involves clear requirements, realistic timelines, and regular check-ins. Tell me more about your specific challenges.",
        "I'd recommend starting with a clear project scope and identifying potential risks early. What type of project are you working on?",
      ];
      return projectResponses[Math.floor(Math.random() * projectResponses.length)];
    }

    // Learning/help
    if (
      message.includes("learn") ||
      message.includes("help") ||
      message.includes("how")
    ) {
      const helpResponses = [
        "I'm here to help! Learning is most effective when broken into small, actionable steps. What specific area would you like to focus on?",
        "That's a great attitude toward learning! I find that hands-on practice combined with solid fundamentals works best. What's your current experience level?",
        "I'd be happy to guide you through this. Let's start with the basics and build up from there. What's your main goal?",
      ];
      return helpResponses[Math.floor(Math.random() * helpResponses.length)];
    }

    // Greetings
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      const greetingResponses = [
        "Hello! I'm here to help you with any questions or tasks you have. What can I assist you with today?",
        "Hi there! Great to meet you. I'm an AI assistant ready to help with technical questions, project planning, or general problem-solving. What's on your mind?",
        "Hey! Welcome to our chat. I'm here to provide helpful insights and assistance. How can I help you today?",
      ];
      return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting point. Could you tell me more about what you're trying to accomplish?",
      "I understand what you're saying. Let me think about the best way to approach this...",
      "Based on your message, it sounds like you're looking for guidance on this topic. Here's what I think...",
      "Thanks for sharing that with me. I'd like to help you find a solution. Can you provide a bit more context?",
      "That's a thoughtful question. There are several ways to approach this, depending on your specific needs and constraints.",
      "I see what you're getting at. Let me offer some perspective that might be helpful...",
      "Good question! This is something many people encounter. Here's how I typically recommend handling it...",
      "I appreciate you bringing this up. From my experience, the key factors to consider are...",
      "That's definitely worth exploring further. What specific outcomes are you hoping to achieve?",
      "Interesting challenge! I think we can work through this step by step. Let me start with...",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  },

  async updateConversation(
    token: string,
    conversationId: number,
    updates: UpdateConversationInput
  ): Promise<UpdateConversationResponse> {
    await delay(600);
    console.log(updates);
    // Token Validation
    if (!token) {
      throw new Error("Unauthorized");
    }

    const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Update only properties that came from updates parameters
    const updatedConversation = {
      ...conversation,
      title: updates.title ?? conversation.title,
      last_message: updates.last_message ?? conversation.last_message,
      updated_at: new Date().toISOString(),
      message_count: MOCK_MESSAGES[conversationId]?.length || 0,
    };

    // Persist changes in local MOCK_CONVERSATIONS
    const index = MOCK_CONVERSATIONS.findIndex((c) => c.id === conversationId);
    MOCK_CONVERSATIONS[index] = updatedConversation;

    return { conversation: updatedConversation };
  },

  // ==========================================
  // USER PROFILE
  // ==========================================

  async updateProfile(
    token: string,
    updates: UpdateProfileInput
  ): Promise<UpdateProfileResponse> {
    await delay(1000);

    if (!token) {
      throw new Error("Unauthorized");
    }

    const userId = parseInt(token.split("-")[3]);
    const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

    const updatedUser = {
      ...user,
      ...updates,
      id: user.id, // Prevent ID changes
    };

    return { user: updatedUser };
  },
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export const mockHelpers: MockHelpers = {
  // Generate a realistic typing delay based on message length
  getTypingDelay(messageLength: number): number {
    const baseDelay = 1000;
    const charactersPerSecond = 50;
    return baseDelay + (messageLength / charactersPerSecond) * 1000;
  },

  // Validate token format
  isValidToken(token: unknown): boolean {
    if (typeof token !== "string") return false;
    return token.startsWith("mock-jwt-token");
  },

  // Format dates consistently
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  },

  // Generate conversation title from first message
  generateTitle(firstMessage: string): string {
    if (!firstMessage) return "New Conversation";

    const words = firstMessage.split(" ").slice(0, 4);
    return words.join(" ") + (firstMessage.split(" ").length > 4 ? "..." : "");
  },
};

// ==========================================
// USAGE EXAMPLES
// ==========================================

/*
// Example usage in your React components:

import { mockApi } from './mockApi';

// Login
try {
  const result = await mockApi.login('demo@example.com', 'password123');
  localStorage.setItem('token', result.token);
  setUser(result.user);
} catch (error) {
  setError(error.message);
}

// Get conversations
try {
  const result = await mockApi.getConversations(token);
  setConversations(result.conversations);
} catch (error) {
  console.error('Failed to load conversations:', error);
}

// Send message and get AI response
try {
  const userMsg = await mockApi.sendMessage(token, conversationId, message);
  setMessages(prev => [...prev, userMsg.message]);
  
  // Show typing indicator
  setIsTyping(true);
  
  // Get AI response
  const aiResponse = await mockApi.simulateAIResponse(conversationId, message);
  setIsTyping(false);
  setMessages(prev => [...prev, aiResponse.message]);
} catch (error) {
  console.error('Failed to send message:', error);
  setIsTyping(false);
}
*/
