import { useState } from "react";
import accountClient from "../../../shared/api/accountClient";
import pointsClient from "../../../shared/api/pointsClient";
import { useAuthStore } from "../../../shared/store/authStore";

export const useDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMisCuentas = async () => {
        try {
            setLoading(true);
            setError(null);
            const user = useAuthStore.getState().user;
            const userId = user?.id;
            if (!userId) {
                throw new Error("Usuario no autenticado");
            }
            const response = await accountClient.get(`/cuentas/usuario/${userId}`);
            const cuentas = response.data.data || [];
            return cuentas.filter(c => c.isActive === true);
        } catch (err) {
            setError(err.response?.data?.message || "Error al obtener cuentas");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchServiciosActivos = async () => {
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

    const fetchCrearCuenta = async ({ tipo_cuenta, saldo, alias }) => {
        const response = await accountClient.post("/cuentas/create", {
            tipo_cuenta,
            saldo: saldo ? Number(saldo) : 100,
            alias: alias || undefined,
        });
        return response.data;
    };

    return {
        fetchMisCuentas,
        fetchServiciosActivos,
        fetchCrearCuenta,
        loading,
        error,
    };
};