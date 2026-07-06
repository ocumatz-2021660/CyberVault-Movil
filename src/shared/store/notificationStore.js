import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  visible: false,
  message: "",
  type: "error",
  duration: 4000,

  showNotification: ({ message, type = "error", duration = 6700 }) => {//sixseven
    set({
      visible: true,
      message,
      type,
      duration,
    });
  },

  hideNotification: () => {
    set({ visible: false, message: "", type: "error" });
  },
}));
