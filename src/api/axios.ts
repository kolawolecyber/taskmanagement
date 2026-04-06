import axios from "axios";
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000");



// ✅ Base API instance
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // important if using cookies
});

// ✅ Request interceptor (attach token securely)
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
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // force logout
    }
    return Promise.reject(err);
  }
);