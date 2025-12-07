"use client";

import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();

  // Token management helpers
  const setTokens = (accessToken, refreshToken = null) => {
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  };

  const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const getToken = () => localStorage.getItem("access_token");

  // SWR fetcher
  const fetcher = async (url) => {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token");
    }

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        clearTokens();
      }
      throw error;
    }
  };

  // SWR hook
  const {
    data: user,
    error,
    mutate,
  } = useSWR(getToken() ? "/api/v1/user" : null, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  // ========== REGISTER (Token-based) ==========
  const register = async (props) => {
    try {
      const res = await axios.post("/api/v1/register", props);

      // Store token if returned
      if (res.data.access_token) {
        setTokens(res.data.access_token, res.data.refresh_token);
      }

      // Refresh user data
      await mutate();

      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // ========== LOGIN (Token-based) ==========
  const login = async (props) => {
    try {
      console.log("🔐 Sending login request...");

      const res = await axios.post("/api/v1/login", props);

      // Store tokens
      if (res.data.access_token) {
        setTokens(res.data.access_token, res.data.refresh_token);

        // Force update axios header immediately
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.access_token}`;
      }

      // Refresh user data - important to wait for this
      console.log("🔄 Mutating user data...");
      await mutate();

      console.log("🎉 Login process completed");
      return res.data;
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  // ========== LOGOUT ==========
  const logout = async () => {
    try {
      const token = getToken();
      if (token) {
        await axios.post("/api/v1/logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearTokens();
      await mutate(null, false);
      window.location.href = "/login";
    }
  };

  // ========== FORGOT PASSWORD ==========
  const forgotPassword = async ({ email }) => {
    try {
      const response = await axios.post("/api/v1/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // ========== RESET PASSWORD ==========
  const resetPassword = async (props) => {
    try {
      const response = await axios.post("/api/v1/reset-password", props);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // ========== RESEND VERIFICATION ==========
  const resendEmailVerification = async () => {
    try {
      const response = await axios.post(
        "/api/v1/email/verification-notification"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // ========== AUTH EFFECTS ==========
  useEffect(() => {
    const token = getToken();

    if (middleware === "guest" && redirectIfAuthenticated && token && user) {
      router.push(redirectIfAuthenticated);
    }

    if (middleware === "auth" && !token && user === undefined) {
      router.push("/login");
    }
  }, [user, middleware, redirectIfAuthenticated, router]);

  useEffect(() => {
    if (error?.response?.status === 401) {
      clearTokens();
      if (middleware === "auth") {
        router.push("/login");
      }
    }
  }, [error, middleware, router]);

  return {
    user,
    isLoading: !error && !user && getToken() !== null,
    isAuthenticated: !!getToken() && !!user,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    mutate,
  };
};
