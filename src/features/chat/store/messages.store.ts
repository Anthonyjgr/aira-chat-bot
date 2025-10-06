import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApi } from "@/lib/mockApi/mock_API";
import type { MessageState } from "@/types/chat";
import { toast } from "react-toastify";

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messagesByConversation: {},
      isLoading: false,
      error: null,

      fetchMessages: async (token, conversationId) => {
        set({ isLoading: true, error: null });
        try {
          const { messages } = await mockApi.getMessages(token, conversationId);
          const current = get().messagesByConversation;
          set({
            messagesByConversation: {
              ...current,
              [conversationId]: messages,
            },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to load messages";
          set({ error: message });
          toast.error(message + " please try again", {
            toastId: message,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      addMessage: (conversationId, message) => {
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: [
              ...(state.messagesByConversation[conversationId] || []),
              message,
            ],
          },
        }));
      },

      setMessages: (conversationId, messages) => {
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: messages,
          },
        }));
      },

      clearMessages: (conversationId) => {
        set((state) => {
          const updated = { ...state.messagesByConversation };
          delete updated[conversationId];
          return { messagesByConversation: updated };
        });
      },
    }),
    {
      name: "aira-messages-storage",
      partialize: (state) => ({
        messagesByConversation: state.messagesByConversation,
      }),
    }
  )
);

// useEffect(() => {
//   let isCancelled = false; // bandera local

//   const fetchMessages = async () => {
//     if (!conversationId || !tokens) return;
//     setLoading(true); // importante: reiniciamos el estado
//     try {
//       const res = await mockApi.getMessages(tokens.token, Number(conversationId));
//       if (!isCancelled) setMessages(res.messages); // solo si sigue activo
//     } catch (err) {
//       if (!isCancelled) console.error(err);
//     } finally {
//       if (!isCancelled) setLoading(false);
//     }
//   };

//   fetchMessages();

//   // cleanup que cancela el fetch anterior
//   return () => {
//     isCancelled = true;
//   };
// }, [conversationId, tokens]);

// if (err instanceof Error && err.message === "AI service temporarily unavailable") {
//   const retryFn = async () => {
//     setisTyping(true);
//     try {
//       const { message: aiMsg } = await mockApi.simulateAIResponse(convId, content);
//       setMessages((prev) => prev.filter((m) => !m.isError));
//       setMessages((prev) => [...prev, aiMsg]);

//       // actualizar last_message optimistamente en retry
//       updateConversationInStore({
//         id: convId,
//         title,
//         user_id: user?.id ?? 0,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         last_message: aiMsg.content,
//         message_count: messages.length + 2,
//       });

//       await mockApi.updateConversation(tokens.token, convId, {
//         last_message: aiMsg.content,
//       });
//     } catch (retryErr) {
//       console.error("Retry failed:", retryErr);
//     } finally {
//       setisTyping(false);
//     }
//   };

//   const errorMsg: Message = {
//     id: Date.now(),
//     conversation_id: convId,
//     content: "AI service temporarily unavailable. Please try again.",
//     is_from_ai: true,
//     created_at: new Date().toISOString(),
//     isError: true,
//     retryCallback: retryFn,
//   };

//   // setMessages((prev) => [...prev, errorMsg]);
//   addMessage(Number(conversationId), errorMsg)
// }
