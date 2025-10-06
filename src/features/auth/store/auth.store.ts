import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "../../../types/auth";
import { mockApi } from "@/lib/mockApi/mock_API";
import { toast } from "react-toastify";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isLoading: false,
      error: null,

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

      logout: () => {
        set({ user: null, tokens: null, error: null });
        localStorage.removeItem("aira-conversations-storage"); // ✅ limpia las conversaciones persistidas
      },

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

    //WE CREATE THE STORAGE KEY WHERE WE WILL SAVE OUR SESSION ESSENTIAL DATA TO PERSIST THE USER SESSION
    {
      name: "aira-auth-storage", // clave en localStorage
      partialize: (state) => ({ user: state.user, tokens: state.tokens }),
    }
  )
);
