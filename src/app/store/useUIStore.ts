import type { UIState } from "@/types/ui";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      isDrawerOpen: false,

      toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      },

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle("dark", theme === "dark");
      },
    }),
    {
      name: "aira-ui-storage",
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle("dark", state.theme === "dark");
        }
      },
    }
  )
);

