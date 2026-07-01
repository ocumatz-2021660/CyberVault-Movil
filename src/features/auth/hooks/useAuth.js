import { useState } from "react";
import authClient from "../../../shared/api/authClient";
import { useAuthStore } from "../../../shared/store/authStore";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);

    const handleLogin = async (data) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authClient.post("/login", data);
            const { token, userDetails } = response.data;
            await login(token, userDetails);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al iniciar sesión");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (formData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authClient.post("/register", formData);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al registrarse");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async (token) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authClient.post("/verify-email", { token });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al verificar email");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (email) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authClient.post("/forgot-password", { email });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al recuperar contraseña");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (token, newPassword) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authClient.post("/reset-password", {
                token,
                newPassword,
                confirmPassword: newPassword,
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al restablecer contraseña");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleLogin,
        handleRegister,
        handleVerifyEmail,
        handleForgotPassword,
        handleResetPassword,
        loading,
        error,
        logout,
    };
};