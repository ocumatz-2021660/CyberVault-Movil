import { useState } from "react";
import accountClient from "../../../shared/api/accountClient";

export const useWithdrawals = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const crearRetiro = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await accountClient.post("/withdrawals", data);
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || "Error al realizar el retiro";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { crearRetiro, loading, error };
};

export default useWithdrawals;