import { useState } from "react";
import accountClient from "../../../shared/api/accountClient";

export const useTransactions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFavoritos = async () => {
        const response = await accountClient.get("/favorite");
        return response.data.data || [];
    };

    const crearTransaccion = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await accountClient.post("/transactions", data);
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || "Error para realizar la transferencia";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { fetchFavoritos, crearTransaccion, loading, error };
};

export default useTransactions;