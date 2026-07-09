import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { ENDPOINTS } from "../constants/endpoints";

const accountClient = axios.create({
    baseURL: ENDPOINTS.ACCOUNT,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

accountClient.interceptors.request.use(async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

accountClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    },
);

export default accountClient;