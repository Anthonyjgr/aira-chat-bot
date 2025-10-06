import type { ConversationsResponse, Message } from "./conversation";

export interface AuthTokens {
  token: string;
  expiresAt: number; // timestamp en ms
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface GetCurrentUserResponse {
  user: User;
}

export interface LoginResponse {
  user: User;
  token: string;
  expires_in: number;
}

export interface UpdateProfileResponse {
  user: User;
}

export interface RegisterUserResponse {
  user: User;
  token: string;
  expires_in: number;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  avatar?: string;
  password?: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadSession: () => Promise<void>;
  updateUserProfile: (updates: UpdateProfileInput) => Promise<void>;
}
