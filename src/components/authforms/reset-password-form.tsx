// components/auth/reset-password-form.tsx
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth"; // Updated import
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react"; // Added icons

// Logo image
import LogoImg from "../../../public/assets/icons/logo-small.png";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    password_confirmation?: string;
  }>({});
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const searchParams = useSearchParams();

  const { resetPassword } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/",
  });

  useEffect(() => {
    // Get token from route parameters (path)
    const routeToken = params.token as string;

    // Get email from URL search parameters
    const urlEmail = searchParams.get("email");

    if (routeToken) {
      setToken(routeToken);
    }

    if (urlEmail) {
      setEmail(urlEmail);
    }

    // Debug log
    console.log("Route token:", routeToken);
    console.log("URL email:", urlEmail);
  }, [params, searchParams]);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    return errors;
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
      password_confirmation?: string;
    } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else {
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors[0];
      }
    }

    // Password confirmation validation
    if (!passwordConfirmation.trim()) {
      newErrors.password_confirmation = "Please confirm your password";
    } else if (password !== passwordConfirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors and status
    setErrors([]);
    setFormErrors({});
    setStatus(null);

    // Validate token
    if (!token) {
      setErrors(["Reset token is missing or invalid"]);
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call the resetPassword function (token-based)
      const result = await resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      console.log("Reset password result:", result);

      // Handle success response
      if (result?.message) {
        setStatus(result.message);
      } else if (result?.status) {
        setStatus(result.status);
      } else {
        setStatus("Password reset successful!");
      }

      // If we got an access token, user is logged in
      if (result?.access_token) {
        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err: any) {
      console.error("Reset password error:", err);

      // Handle API errors
      if (err.response?.data?.errors) {
        // Laravel validation errors format
        const errorMessages: string[] = [];
        Object.values(err.response.data.errors).forEach((errorArray: any) => {
          if (Array.isArray(errorArray)) {
            errorMessages.push(...errorArray);
          }
        });
        setErrors(errorMessages);
      } else if (err.response?.data?.message) {
        setErrors([err.response.data.message]);
      } else if (err.message) {
        setErrors([err.message]);
      } else {
        setErrors(["Failed to reset password. Please try again."]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasErrors = errors.length > 0 || Object.keys(formErrors).length > 0;
  const isSuccess = status !== null;

  // Real-time validation handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (formErrors.password && value.trim()) {
      setFormErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setPasswordConfirmation(value);
    if (formErrors.password_confirmation && value.trim()) {
      setFormErrors((prev) => ({ ...prev, password_confirmation: undefined }));
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
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

                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your new password to reset your account.
                </p>
              </div>

              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === "development" && (
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <div>
                    Token: {token ? `${token.substring(0, 20)}...` : "missing"}
                  </div>
                  <div>Email: {email || "missing"}</div>
                </div>
              )}

              {/* Success Message */}
              {status && (
                <div className="p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm">
                  {status}
                  <div className="mt-1 text-xs">
                    Redirecting you{" "}
                    {status.includes("successful") ? "home" : "to login"}...
                  </div>
                </div>
              )}

              {/* Server Error Messages */}
              {errors.length > 0 && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
                  <ul className="space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <span>•</span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className={
                      formErrors.email
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                  />
                  {formErrors.email && (
                    <div className="text-red-500 text-sm flex items-center gap-1">
                      <span>•</span>
                      {formErrors.email}
                    </div>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      disabled={isLoading}
                      className={`pl-3 pr-10 ${
                        formErrors.password
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <div className="text-red-500 text-sm flex items-center gap-1">
                      <span>•</span>
                      {formErrors.password}
                    </div>
                  )}
                  {!formErrors.password && password && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p
                        className={password.length >= 8 ? "text-green-600" : ""}
                      >
                        • At least 8 characters{" "}
                        {password.length >= 8 ? "✓" : ""}
                      </p>
                      <p
                        className={
                          /(?=.*[a-z])/.test(password) ? "text-green-600" : ""
                        }
                      >
                        • One lowercase letter{" "}
                        {/(?=.*[a-z])/.test(password) ? "✓" : ""}
                      </p>
                      <p
                        className={
                          /(?=.*[A-Z])/.test(password) ? "text-green-600" : ""
                        }
                      >
                        • One uppercase letter{" "}
                        {/(?=.*[A-Z])/.test(password) ? "✓" : ""}
                      </p>
                      <p
                        className={
                          /(?=.*\d)/.test(password) ? "text-green-600" : ""
                        }
                      >
                        • One number {/(?=.*\d)/.test(password) ? "✓" : ""}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="passwordConfirmation">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="passwordConfirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={passwordConfirmation}
                      onChange={handlePasswordConfirmChange}
                      required
                      disabled={isLoading}
                      className={`pl-3 pr-10 ${
                        formErrors.password_confirmation
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formErrors.password_confirmation && (
                    <div className="text-red-500 text-sm flex items-center gap-1">
                      <span>•</span>
                      {formErrors.password_confirmation}
                    </div>
                  )}
                  {passwordConfirmation &&
                    password !== passwordConfirmation && (
                      <div className="text-red-500 text-sm">
                        • Passwords do not match
                      </div>
                    )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !token}
                className="w-full bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : !token ? (
                  "Loading..."
                ) : (
                  "Reset Password"
                )}
              </Button>

              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
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
