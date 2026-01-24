"use client";

import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();
  const [justRegistered, setJustRegistered] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);

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

  // Check if user needs verification
  const needsVerification = (userData) => {
    if (!userData) return false;

    // Check various possible verification indicators
    return (
      userData.email_verified_at === null ||
      userData.verification === "PENDING" ||
      userData.status === "INACTIVE"
    );
  };

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
    onSuccess: (data) => {
      console.log("✅ User data fetched:", {
        email: data?.email,
        verified: data?.email_verified_at,
        needsVerification: needsVerification(data),
      });
    },
  });

  // ========== REGISTER (Token-based) ==========
  const register = async (props) => {
    try {
      console.log("📤 Sending registration request...");

      const res = await axios.post("/api/v1/register", props);

      console.log("📦 Registration response:", {
        hasToken: !!res.data.access_token,
        hasUser: !!res.data.user,
        requiresVerification: res.data.requires_verification,
      });

      // Store token if returned (check BOTH camelCase and snake_case)
      const accessToken = res.data.access_token || res.data.accessToken;
      const refreshToken = res.data.refresh_token || res.data.refreshToken;

      if (accessToken) {
        setTokens(accessToken, refreshToken);
        setJustRegistered(true); // Mark as just registered
      }

      // Refresh user data
      await mutate("/api/v1/user");

      return res.data;
    } catch (error) {
      console.error(
        "❌ Registration error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  // ========== LOGIN (Token-based) ==========
  const login = async (props) => {
    try {
      console.log("🔐 Sending login request...");

      const res = await axios.post("/api/v1/login", props);

      // Store tokens (check BOTH camelCase and snake_case)
      const accessToken = res.data.access_token || res.data.accessToken;
      const refreshToken = res.data.refresh_token || res.data.refreshToken;

      if (accessToken) {
        setTokens(accessToken, refreshToken);
        // Force update axios header immediately
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
      }

      // Refresh user data - important to wait for this
      console.log("🔄 Mutating user data...");
      await mutate("/api/v1/user");

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
      setJustRegistered(false); // Reset registration flag
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
        "/api/v1/email/verification-notification",
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // ========== AUTH EFFECTS ==========
  useEffect(() => {
    const token = getToken();

    console.log("🔍 Auth useEffect triggered:", {
      token: token ? "present" : "missing",
      user: user ? "loaded" : "not loaded",
      justRegistered,
      middleware,
      redirectIfAuthenticated,
      needsVerification: user ? needsVerification(user) : "no user",
    });

    // If guest and authenticated
    if (middleware === "guest" && redirectIfAuthenticated && token && user) {
      // Check if user just registered
      if (justRegistered) {
        console.log("🔄 Just registered, redirecting to verification...");
        router.push("/verify");
        setJustRegistered(false); // Reset flag
        return;
      }

      // Check if user needs verification
      if (needsVerification(user)) {
        console.log("🔐 User needs verification, redirecting...");
        router.push("/verify");
        return;
      }

      // User is authenticated and verified, redirect to intended page
      console.log(
        "🚀 User authenticated & verified, redirecting to:",
        redirectIfAuthenticated,
      );
      router.push(redirectIfAuthenticated);
      return;
    }

    // If auth required but no token
    if (middleware === "auth" && !token && !user && !error) {
      console.log("🔒 No token, redirecting to login...");
      router.push("/login");
      return;
    }

    // If auth required and token exists but user failed to load
    if (middleware === "auth" && token && error?.response?.status === 401) {
      console.log("⚠️ Token invalid, clearing and redirecting...");
      clearTokens();
      router.push("/login");
      return;
    }
  }, [
    user,
    error,
    middleware,
    redirectIfAuthenticated,
    router,
    justRegistered,
  ]);

  return {
    user,
    isLoading: !error && !user && getToken() !== null,
    isAuthenticated: !!getToken() && !!user,
    needsVerification: user ? needsVerification(user) : false,
    justRegistered,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    mutate,
    setJustRegistered, // Allow manual control
  };
};
