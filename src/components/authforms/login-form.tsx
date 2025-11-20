"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

// Logo image
import LogoImg from "../../../public/assets/icons/logo-small.png";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Handle router reset messages
  useEffect(() => {
    const resetMsg = (router as any)?.reset;
    if (resetMsg?.length > 0 && errors.length === 0) {
      setStatus(atob(resetMsg));
    } else {
      setStatus(null);
    }
  }, [router, errors]);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();

    // Clear previous errors
    setApiError(null);
    setErrors([]);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await login({
        email,
        password,
        setErrors,
        setStatus,
      });

      console.log("Login successful:", data);
      // Router will handle redirect via the auth hook
    } catch (err: any) {
      console.error("Login failed:", err);

      // Handle API errors
      if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else if (err.message) {
        setApiError(err.message);
      } else {
        setApiError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time email validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear email error when user starts typing
    if (formErrors.email && value.trim()) {
      setFormErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  // Real-time password validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // Clear password error when user starts typing
    if (formErrors.password && value.trim()) {
      setFormErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={submitForm} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div
                  className="mb-4 z-50"
                  style={{ width: "50%", height: "20px" }}
                >
                  <Link href={"/"}>
                    <Image
                      src={LogoImg}
                      alt="GoHive"
                      className="w-full h-full object-cover overflow-visible"
                    />
                  </Link>
                </div>
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your HiveGo account
                </p>
              </div>

              {/* Email Field */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    disabled={isLoading}
                    className={`pl-10 ${
                      formErrors.email
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span>•</span>
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    disabled={isLoading}
                    className={`pl-10 pr-10 ${
                      formErrors.password
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  {/* Eye Icon Toggle */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span>•</span>
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* API Error Message */}
              {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm font-medium">{apiError}</p>
                </div>
              )}

              {/* Server-side Error Messages */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <ul className="text-red-700 text-sm space-y-1">
                    {errors.map((err, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span>•</span>
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success Status Message */}
              {status && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm">{status}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>

          {/* Background Image */}
          <div className="bg-muted relative hidden md:block">
            <Image
              className="object-cover filter grayscale"
              src="/assets/auth/auth-bg.png"
              alt="Next.js logo"
              fill
              priority
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
