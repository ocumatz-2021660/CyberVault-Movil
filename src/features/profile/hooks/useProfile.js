import { useState } from "react";
import authClient from "../../../shared/api/authClient";

export const useProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await authClient.get("/profile");
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al obtener perfil");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authClient.put("/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar perfil");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { getProfile, updateProfile, loading, error };
};