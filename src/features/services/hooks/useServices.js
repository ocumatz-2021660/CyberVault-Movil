import { useState } from "react";
import pointsClient from "../../../shared/api/pointsClient";
import accountClient from "../../../shared/api/accountClient";
import { useAuthStore } from "../../../shared/store/authStore";

export const useServices = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchServicios = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await pointsClient.get("/services", {
                params: { isActive: true, limit: 50 }
            });
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al obtener servicios");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchCuentas = async () => {
        try {
            const user = useAuthStore.getState().user;
            const response = await accountClient.get(`/cuentas/usuario/${user.id}`);
            const cuentas = response.data.data || [];
            return cuentas.filter(c => c.isActive === true);
        } catch (err) {
            setError(err.response?.data?.message || "Error al obtener cuentas");
            throw err;
        }
    };

    const canjearServicio = async ({ cuenta_canje, servicio_canje }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await pointsClient.post("/redeem_services/redeem", {
                cuenta_canje,
                servicio_canje,
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al canjear el servicio");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchServicios,
        fetchCuentas,
        canjearServicio,
        loading,
        error,
    };
};