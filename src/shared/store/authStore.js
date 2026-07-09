import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            _hasHydrated: false,

            setHasHydrated: (state) => set({ _hasHydrated: state }),

            login: async (accessToken, user) => {
                set({
                    token: accessToken,
                    user,
                    isAuthenticated: true,
                });
            },

            setAccessToken: (token) => set({ token }),

            logout: async () => {
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    set({ _hasHydrated: true });
                } else if (state) {
                    state.setHasHydrated(true);
                } else {
                    set({ _hasHydrated: true });
                }
            },
        },
    ),
);