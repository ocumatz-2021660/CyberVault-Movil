import { useState } from "react";
import accountClient from "../../../shared/api/accountClient";

export const useFavorites = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFavorites = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await accountClient.get("/favorite");
            return response.data.data || [];
        } catch (err) {
            const message = err.response?.data?.message || "Error al obtener favoritos";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addFavorite = async (no_cuenta, alias_favorito) => {
        setLoading(true);
        setError(null);
        try {
            const response = await accountClient.post("/favorite", { no_cuenta, alias_favorito });
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || "Error al agregar favorito";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteFavorite = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await accountClient.delete(`/favorite/${id}`);
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || "Error al eliminar favorito";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { fetchFavorites, addFavorite, deleteFavorite, loading, error };
};