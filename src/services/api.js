// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

// ✅ RESPONSE INTERCEPTOR (FIXED)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Session expired");

      localStorage.removeItem("user");

      // ❌ DO NOT reload app
      // Instead just let app handle auth state
    }

    return Promise.reject(error);
  }
);

export default api;