import { useEffect, useCallback } from "react";
import { useSettingsStore } from "../store/settingStore";
import {
    getExchangeRate,
    convertToDisplay,
    convertToBase,
    formatCurrency,
    getCurrencySymbol,
} from "../utils/currencyUtils";

export const useCurrency = () => {
    const currency = useSettingsStore((s) => s.currency);
    const rate = useSettingsStore((s) => s.exchangeRate);
    const setExchangeRate = useSettingsStore((s) => s.setExchangeRate);

    useEffect(() => {
        if (currency === "GTQ") {
            setExchangeRate(1);
            return;
        }
        getExchangeRate(currency).then((r) => {
            if (r) setExchangeRate(r);
        });
    }, [currency, setExchangeRate]);

    const formatConverted = useCallback(
        (amountGTQ) => formatCurrency(convertToDisplay(amountGTQ, rate), currency),
        [rate, currency],
    );

    const toBase = useCallback(
        (amountInSelected) => convertToBase(amountInSelected, rate),
        [rate],
    );

    const symbol = getCurrencySymbol(currency);

    return { rate, currency, symbol, formatConverted, toBase };
};