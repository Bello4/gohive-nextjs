"use client";

import useSWR from "swr";
import axios from "@/lib/axios";
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
        if (error.response.status !== 409) throw error;

        router.push("/verify-email");
      })
  );

  const csrf = () => axios.get("sanctum/csrf-cookie");

  const register = async ({ setErrors, ...props }) => {
    await csrf();

    setErrors([]);

    // axios
    //   .post("/register", props)
    //   .then(() => mutate())
    //   .catch((error) => {
    //     if (error.response.status !== 422) throw error;

    //     setErrors(error.response.data.errors);
    //   });

    try {
      const res = await axios.post("api/v1/register", props);

      // Refresh user data
      await mutate();

      return res.data;
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        throw error;
      }
    }
  };

  // const login = async ({ setErrors, setStatus, ...props }) => {
  //   await csrf();

  //   setErrors([]);
  //   setStatus(null);

  //   axios
  //     .post("/login", props)
  //     .then(() => mutate())
  //     .catch((error) => {
  //       if (error.response.status !== 422) throw error;

  //       setErrors(error.response.data.errors);
  //     });
  // };

  const login = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    try {
      const res = await axios.post("api/v1/login", props);

      // Refresh user data
      await mutate();

      return res.data;
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        throw error;
      }
    }
  };

  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("api/v1/forgot-password", { email })
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  // const resetPassword = async ({ setErrors, setStatus, ...props }) => {
  //   await csrf();

  //   setErrors([]);
  //   setStatus(null);

  //   axios
  //     .post("api/v1/reset-password", { token: params.token, ...props })
  //     .then((response) =>
  //       router.push("/login?reset=" + btoa(response.data.status))
  //     )
  //     .catch((error) => {
  //       if (error.response.status !== 422) throw error;

  //       setErrors(error.response.data.errors);
  //     });
  // };
  // hooks/useAuth.js
  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    // Make sure we're sending the token in the request
    console.log("Sending reset password request with:", {
      email: props.email,
      token: props.token ? `${props.token.substring(0, 20)}...` : "missing",
      hasPassword: !!props.password,
      hasPasswordConfirmation: !!props.password_confirmation,
    });

    axios
      .post("/api/v1/reset-password", props) // Just pass all props directly
      .then((response) => {
        console.log("Reset password success:", response.data);
        router.push("/login?reset=" + btoa(response.data.status));
      })
      .catch((error) => {
        console.error("Reset password error:", error.response?.data);
        if (error.response?.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const resendEmailVerification = ({ setStatus }) => {
    axios
      .post("/email/verification-notification")
      .then((response) => setStatus(response.data.status));
  };

  const logout = async () => {
    if (!error) {
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/login";
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);

    if (middleware === "auth" && error) logout();
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
