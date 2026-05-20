import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: false,
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("securestego_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired tokens globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail || "";

    if (
      status === 401 &&
      (detail.includes("token") || detail.includes("authoriz"))
    ) {
      localStorage.removeItem("securestego_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;