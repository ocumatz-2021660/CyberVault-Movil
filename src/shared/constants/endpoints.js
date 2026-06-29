export const ENDPOINTS = {
    AUTH: process.env.EXPO_PUBLIC_AUTH_URL || "http://localhost:3001/api/v1/auth",
    ACCOUNT: process.env.EXPO_PUBLIC_ACCOUNT_URL || "http://localhost:3002/api/v1",
    POINTS: process.env.EXPO_PUBLIC_POINTS_URL || "http://localhost:3003/api/v1",
}