"use client";

import useSWR from "swr";
import axios from "../lib/axios";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();
  const params = useParams();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/v1/user", () =>
    axios
      .get("/api/v1/user")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response?.status === 409) {
          router.push("/verify-email");
        }
        throw error;
      })
  );

  // CSRF function - FIXED
  const csrf = async () => {
    try {
      // Use absolute path for CSRF
      await axios.get("/sanctum/csrf-cookie");
      console.log("CSRF token obtained");
    } catch (error) {
      console.error("CSRF Error:", error);
      throw error;
    }
  };

  // REGISTER - FIXED
  const register = async ({ setErrors, ...props }) => {
    await csrf();
    setErrors([]);

    try {
      const res = await axios.post("/api/v1/register", props);
      await mutate(); // Refresh user data
      return res.data;
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        throw error;
      }
    }
  };

  // LOGIN - FIXED (most important!)
  const login = async ({ setErrors, setStatus, ...props }) => {
    await csrf(); // Get CSRF token FIRST

    setErrors([]);
    setStatus(null);

    try {
      const res = await axios.post("/api/v1/login", props);
      await mutate(); // Refresh user data
      return res.data;
    } catch (error) {
      console.error("Login Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        throw error;
      }
    }
  };

  // FORGOT PASSWORD - FIXED
  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    try {
      const response = await axios.post("/api/v1/forgot-password", { email });
      setStatus(response.data.status);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        throw error;
      }
    }
  };

  // RESET PASSWORD - FIXED
  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    try {
      const response = await axios.post("/api/v1/reset-password", props);
      router.push("/login?reset=" + btoa(response.data.status));
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        throw error;
      }
    }
  };

  // LOGOUT - FIXED
  const logout = async () => {
    try {
      await axios.post("/api/v1/logout");
      await mutate(null); // Clear user data
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect to login even if logout fails
      router.push("/login");
    }
  };

  // EMAIL VERIFICATION - FIXED
  const resendEmailVerification = async ({ setStatus }) => {
    try {
      const response = await axios.post(
        "/api/v1/email/verification-notification"
      );
      setStatus(response.data.status);
    } catch (error) {
      console.error("Email verification error:", error);
    }
  };

  // useEffect for middleware
  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated);
    }

    if (middleware === "auth" && error) {
      logout();
    }
  }, [user, error]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  };
};
