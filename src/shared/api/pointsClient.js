import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { ENDPOINTS } from "../constants/endpoints";

const pointsClient = axios.create({
    baseURL: ENDPOINTS.POINTS,
    headers: {
        "Content-Type": "application/json",
    },
});

pointsClient.interceptors.request.use(async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

pointsClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    },
);

export default pointsClient;