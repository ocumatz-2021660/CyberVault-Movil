
import { useState } from "react";
import accountClient from "../../../shared/api/accountClient";

export const useHistory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHistory = async (cuentaId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await accountClient.get(`/transactions/account/${cuentaId}`);
            return response.data.data || [];
        } catch (err) {
            const message = err.response?.data?.message || "Error al obtener el historial";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteTransaction = async (transactionId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await accountClient.delete(`/transactions/cancelar/${transactionId}`);
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || "Error al cancelar la transacción";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { fetchHistory, deleteTransaction, loading, error };
};

export default useHistory;