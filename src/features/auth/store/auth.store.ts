import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "../../../types/auth";
import { mockApi } from "@/lib/mockApi/mock_API";
import { toast } from "react-toastify";

/**
 * useAuthStore
 * ------------------
 * Zustand store responsible for managing user authentication state.
 *
 * Features:
 * - Persisted session across reloads (via localStorage)
 * - Login, register, logout, session recovery, and profile update logic
 * - Token-based authentication with mock API
 * - Error handling with toast notifications
 *
 * Architecture Notes:
 * - The store follows the Single Source of Truth principle for user and token data.
 * - Each async action manages its own loading and error state to provide UI feedback.
 * - All API calls are made through `mockApi`, keeping domain logic isolated from transport.
 */

export const useAuthStore = create<AuthState>()(
  persist(
    // ---------------------------
    // Core State
    // ---------------------------
    (set, get) => ({
      user: null, // Holds the authenticated user data
      tokens: null, // Stores access token and expiration
      isLoading: false, // Loading indicator for async operations
      error: null, // Stores error messages for UI feedback

      // ---------------------------
      // Authentication Actions
      // ---------------------------

      /**
       * 🔑 login
       * Authenticates a user and initializes their session.
       *
       * @param email - User email
       * @param password - User password
       *
       * On success:
       * - Retrieves user and token from API
       * - Calculates token expiration timestamp
       * - Persists session state in localStorage
       *
       * On error:
       * - Displays toast notification
       * - Updates `error` state
       */

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token, expires_in } = await mockApi.login(email, password);
          const expiresAt = Date.now() + expires_in * 1000;
          set({ user, tokens: { token, expiresAt } });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Login failed";
          set({ error: message });
          toast.error(message + " please try again", {
            toastId: message,
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       *  register
       * Registers a new user and immediately authenticates them.
       *
       * @param name - User’s full name
       * @param email - User email
       * @param password - User password
       *
       * Behavior mirrors the login flow — persists session upon success.
       */

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token, expires_in } = await mockApi.register(
            email,
            password,
            name
          );
          const expiresAt = Date.now() + expires_in * 1000;
          set({ user, tokens: { token, expiresAt } });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Register failed";
          set({ error: message });
          toast.error(message + " please try again", {
            toastId: message,
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * 🚪 logout
       * Clears session data from both Zustand and localStorage.
       * Also removes persisted conversations (cross-store cleanup).
       */

      logout: () => {
        set({ user: null, tokens: null, error: null });
        localStorage.removeItem("aira-conversations-storage");
      },

      /**
       *  loadSession
       * Rehydrates the user session on app start or reload.
       *
       * - Verifies the stored token’s expiration timestamp.
       * - Calls `mockApi.getCurrentUser` if the token is valid.
       * - Clears the session if invalid or expired.
       */

      loadSession: async () => {
        // llamado al inicio para rehidratar sesión
        set({ isLoading: true, error: null });
        try {
          const stored = get().tokens;
          if (!stored) {
            // no hay token
            set({ isLoading: false });
            return;
          }
          // verificar expiración
          if (stored.expiresAt < Date.now()) {
            // expirado
            set({ user: null, tokens: null });
            set({ isLoading: false });
            return;
          }
          // token válido, obtener usuario
          const { user } = await mockApi.getCurrentUser(stored.token);
          set({ user });
        } catch (err: unknown) {
          // falla en fetchCurrentUser
          set({ user: null, tokens: null });
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * ✏️ updateUserProfile
       * Updates user data (e.g., name, avatar, email) via mock API.
       *
       * @param updates - Partial object containing user fields to update
       *
       * Requires a valid token. On success, updates local user state.
       */
      updateUserProfile: async (updates) => {
        const tokens = get().tokens;
        if (!tokens?.token) throw new Error("No active session");

        set({ isLoading: true, error: null });
        try {
          const { user } = await mockApi.updateProfile(tokens.token, updates);
          set({ user });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Update failed";
          set({ error: message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },
    }),

    // ---------------------------
    // Persistence Configuration
    // ---------------------------
    {
      name: "aira-auth-storage", // clave en localStorage
      partialize: (state) => ({ user: state.user, tokens: state.tokens }),
    }
  )
);
