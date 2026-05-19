import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

// Request interceptor: attach JWT token to every request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("securevault_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle expired tokens globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        // If token expired or invalid, log user out
        if (
            error.response?.status === 401 &&
            error.response?.data?.message?.includes("token")
        ) {
            localStorage.removeItem("securevault_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default API;