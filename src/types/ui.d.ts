export interface UIState {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;

  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}
