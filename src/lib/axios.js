// src/lib/axios.js
import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  // No withCredentials for token-based auth
});

// Helper function to safely access localStorage
const getLocalStorageItem = (key) => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error accessing localStorage key "${key}":`, error);
      return null;
    }
  }
  return null;
};

const setLocalStorageItem = (key, value) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }
};

const removeLocalStorageItem = (key) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }
};

// Add a request interceptor to inject the token
axios.interceptors.request.use(
  (config) => {
    // Get token from localStorage (only on client side)
    const token = getLocalStorageItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshToken = getLocalStorageItem("refresh_token");

        if (refreshToken) {
          const response = await axios.post("/api/v1/refresh-token", {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token } = response.data;

          // Store new tokens
          setLocalStorageItem("access_token", access_token);
          setLocalStorageItem("refresh_token", refresh_token);

          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          // Retry the original request
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        removeLocalStorageItem("access_token");
        removeLocalStorageItem("refresh_token");

        // Only redirect on client side
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
