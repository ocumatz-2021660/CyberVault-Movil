import { useState } from "react";
import pointsClient from "../../../shared/api/pointsClient";

export const useCanjes = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCanjes = async (cuentaId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await pointsClient.get(`/redeem_services/${cuentaId}`);
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || "Error al obtener canjes";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };



    return { fetchCanjes, cancelCanje, loading, error };
};

export default useCanjes;