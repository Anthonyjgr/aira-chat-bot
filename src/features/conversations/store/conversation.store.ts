import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApi } from "@/lib/mockApi/mock_API";
import type { ConversationState } from "@/types/conversation";
import { toast } from "react-toastify";

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: [],
      isLoading: false,
      error: null,
      searchQuery: "", // 🔹 nuevo estado

      fetchConversations: async (token: string) => {
        const current = get().conversations;
        if (current.length > 0) {
          console.log("✅ Skipping fetch, using persisted conversations");
          return; // ya hay datos persistidos, no llamamos a la API
        }

        set({ isLoading: true, error: null });
        try {
          const { conversations } = await mockApi.getConversations(token);
          set({ conversations });
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Failed to load conversations";
          set({ error: message });
          toast.error(message, {
            toastId: message,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      setSearchQuery: (query: string) => set({ searchQuery: query }),

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
    }),
    {
      name: "aira-conversations-storage",
      partialize: (state) => ({
        conversations: state.conversations,
      }),
      // ✅ Habilitamos persistencia inmediata
      version: 1,
    }
  )
);

// import { create } from "zustand";
// import { mockApi } from "@/lib/mockApi/mock_API";
// import type { ConversationState } from "@/types/conversation";

// export const useConversationStore = create<ConversationState>((set, get) => ({
//   conversations: [],
//   isLoading: false,
//   error: null,

//   fetchConversations: async (token: string) => {
//     set({ isLoading: true, error: null });
//     try {
//       const { conversations } = await mockApi.getConversations(token);
//       set({ conversations });
//     } catch (err: unknown) {
//       const message = err instanceof Error ? err.message : "Failed to load conversations";
//       set({ error: message });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   createConversation: async (token, title = "New Conversation") => {
//     try {
//       const res = await mockApi.createConversation(token, title);
//       const updated = [...get().conversations, res.conversation];
//       set({ conversations: updated });
//       return res.conversation;
//     } catch (err) {
//       console.error("Error creating conversation:", err);
//       set({ error: "Failed to create conversation" });
//       return null;
//     }
//   },

// updateConversationInStore: (updatedConv) => {
//   set((state) => ({
//     conversations: state.conversations.map((conv) =>
//       conv.id === updatedConv.id
//         ? {
//             ...conv,
//             ...Object.fromEntries(
//               Object.entries(updatedConv).filter(
//                 ([, value]) => value !== undefined && value !== null
//               )
//             ),
//           }
//         : conv
//     ),
//   }));
// },

// }));

// const handleSendMessage = async (content: string) => {
//   if (!conversationId || !tokens) return;

//   const convId = Number(conversationId);
//   const isFirstMessage = messages.length === 0;

//   const title = isFirstMessage
//     ? mockHelpers.generateTitle(content)
//     : messages[0]?.conversation_id.toString() ?? "Untitled";

//   // 🚀 Optimistic update (antes del request real)
//   updateConversationInStore({
//     id: convId,
//     // title,
//     user_id: 1,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//     last_message: content,
//     message_count: messages.length + 1,
//   });

//   try {
//     // 1️⃣ Enviar mensaje del usuario
//     const { message: userMsg } = await mockApi.sendMessage(
//       tokens.token,
//       convId,
//       content
//     );
//     // setMessages((prev) => [...prev, userMsg]);
//     addMessage(Number(conversationId), userMsg);
//     setisTyping(true);

//     // 2️⃣ Actualizar conversación en API (solo título si es primera vez)
//     const updatePayload = isFirstMessage
//       ? { title, last_message: content }
//       : { last_message: content };

//     try {
//       const { conversation: updatedConv } = await mockApi.updateConversation(
//         tokens.token,
//         convId,
//         updatePayload
//       );

//       // ✅ Si era el primer mensaje, actualizamos el store con el título generado
//       if (isFirstMessage && updatedConv.title) {
//         updateConversationInStore(updatedConv);
//       } else {
//         // ✅ Si no, solo actualizamos el last_message
//         updateConversationInStore({
//           id: convId,
//           last_message: updatedConv.last_message,
//           updated_at: updatedConv.updated_at,
//         });
//       }
//     } catch (updateErr) {
//       console.warn("⚠️ Optimistic update failed:", updateErr);
//     }

//     // 3️⃣ Simular respuesta IA
//     const { message: aiMsg } = await mockApi.simulateAIResponse(convId, content);
//     // setMessages((prev) => [...prev, aiMsg]);
//     addMessage(Number(conversationId), aiMsg);
//     setisTyping(false);

//     // 4️⃣ Actualización optimista inmediata del último mensaje (IA)
//     updateConversationInStore({
//       id: convId,
//       user_id: user?.id ?? 0,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       last_message: aiMsg.content,
//       message_count: messages.length + 2,
//     });

//     // 5️⃣ Actualización real del last_message (confirmación final)
//     try {
//       await mockApi.updateConversation(tokens.token, convId, {
//         last_message: aiMsg.content,
//       });
//     } catch (updateErr) {
//       console.warn("⚠️ Update failed after AI:", updateErr);
//     }
//   } catch (err) {
//     console.error("Error sending message:", err);
//     setisTyping(false);

//     if (err instanceof Error && err.message === "AI service temporarily unavailable") {
//       const retryFn = async () => {
//         setisTyping(true);
//         try {
//           const { message: aiMsg } = await mockApi.simulateAIResponse(convId, content);

//           // 💡 Limpiar mensajes de error previos antes de agregar el nuevo
//           const currentMessages = messagesByConversation[convId] || [];
//           const filtered = currentMessages.filter((m) => !m.isError);
//           setMessages(convId, filtered);

//           // ✅ Agregar el nuevo mensaje AI al store persistente
//           addMessage(convId, aiMsg);

//           // ✅ Actualizar last_message optimistamente
//           updateConversationInStore({
//             id: convId,
//             title,
//             user_id: user?.id ?? 0,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//             last_message: aiMsg.content,
//             message_count: filtered.length + 1,
//           });

//           // ✅ Guardar en el mock API
//           await mockApi.updateConversation(tokens.token, convId, {
//             last_message: aiMsg.content,
//           });
//         } catch (retryErr) {
//           console.error("Retry failed:", retryErr);
//         } finally {
//           setisTyping(false);
//         }
//       };

//       // 🧩 Crear mensaje de error persistente
//       const errorMsg: Message = {
//         id: Date.now(),
//         conversation_id: convId,
//         content: "AI service temporarily unavailable. Please try again.",
//         is_from_ai: true,
//         created_at: new Date().toISOString(),
//         isError: true,
//         retryCallback: retryFn,
//       };

//       // ✅ Guardar el mensaje de error en el store persistente
//       addMessage(convId, errorMsg);
//     }

//   } finally {
//     setisTyping(false);
//   }
// };
