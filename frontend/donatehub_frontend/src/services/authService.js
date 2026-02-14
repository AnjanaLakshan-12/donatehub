import axios from 'axios';

// Create a separate axios instance for auth endpoints (they use /api/auth, not /api/v1)
const authApi = axios.create({
    baseURL: "http://localhost:8080/api/auth",
    withCredentials: true
});

export const loginUser = (credentials) => {
    // Spring Security will intercept this and create a session
    console.log("Logging in with credentials:", credentials);
    return authApi.post('/login', credentials)
        .then(response => {
            console.log("Login response:", response);
            return response;
        })
        .catch(error => {
            console.error("Login error:", error.response?.data || error.message);
            throw error;
        });
};

export const logoutUser = () => {
    // Call Spring logout endpoint to invalidate session
    return authApi.post('/logout', {});
};

export const getCurrentUser = () => {
    // Fetch current user using session cookie
    console.log("Fetching current user...");
    return authApi.get('/me')
        .then(response => {
            console.log("Current user response:", response);
            return response;
        })
        .catch(error => {
            console.error("Get current user error:", error.response?.data || error.message);
            throw error;
        });
};