import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AVAILABLE_CURRENCIES = [
    { code: "GTQ", symbol: "Q", name: "Quetzal Guatemalteco" },
    { code: "USD", symbol: "$", name: "Dólar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "Libra" },
    { code: "MXN", symbol: "MX$", name: "Peso Mexicano" },
    { code: "COP", symbol: "COL$", name: "Peso Colombiano" },
];

export const useSettingsStore = create(
    persist(
        (set) => ({
            currency: "USD",
            exchangeRate: 1,
            setCurrency: (currency) => set({ currency }),
            setExchangeRate: (exchangeRate) => set({ exchangeRate }),
        }),
        {
            name: "settings-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);