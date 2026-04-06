import axios from "axios";





export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // important if using cookies
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Response interceptor (handle auth errors globally)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginPath = window.location.pathname === "/login";

    if (err.response?.status === 401 && !isLoginPath) {
      console.warn("Unauthorized! Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);