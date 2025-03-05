import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "light", // Default theme
  setTheme: (newTheme) => {
    localStorage.setItem("theme", newTheme); // Persist theme
    set({ theme: newTheme });
  },
}));

export default useThemeStore;
