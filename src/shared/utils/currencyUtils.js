import accountClient from "../api/accountClient";

const CURRENCY_SYMBOLS = {
    GTQ: "Q", USD: "$", EUR: "€", GBP: "£", MXN: "MX$", COP: "COL$",
};

export const getExchangeRate = async (targetCurrency) => {
    if (targetCurrency === "GTQ") return 1;
    try {
        const res = await accountClient.get(`/currency/rate?to=${targetCurrency}`);
        return res.data.data.rate;
    } catch (error) {
        console.error("Error fetching exchange rate:", error.message);
        return null;
    }
};

export const convertToDisplay = (amountGTQ, rate) => Number(amountGTQ) * Number(rate);

export const convertToBase = (amountInSelected, rate) => Number(amountInSelected) / Number(rate);

export const formatCurrency = (amount, currencyCode = "GTQ") => {
    const symbol = CURRENCY_SYMBOLS[currencyCode] || "Q";
    const formatted = Number(amount).toLocaleString("es-GT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${symbol}${formatted}`;
};

export const getCurrencySymbol = (currencyCode) => CURRENCY_SYMBOLS[currencyCode] || "Q";