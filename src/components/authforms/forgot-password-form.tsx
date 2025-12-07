"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/auth"; // Updated import
import { Loader2 } from "lucide-react"; // Add loading icon

// Logo image
import LogoImg from "../../../public/assets/icons/logo-small.png";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [formError, setFormError] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { forgotPassword } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors and status
    setErrors([]);
    setFormError("");
    setStatus(null);

    // Basic validation
    if (!email.trim()) {
      setFormError("Please enter your email address");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Call the forgotPassword function (token-based, no setErrors/setStatus)
      const result = await forgotPassword({ email });

      // Handle success response
      if (result?.message) {
        setStatus(result.message);
      } else if (result?.status) {
        setStatus(result.status);
      } else {
        setStatus("Password reset link has been sent to your email.");
      }

      // Clear email field on success
      setEmail("");
    } catch (err: any) {
      console.error("Forgot password error:", err);

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
        setFormError(err.response.data.message);
      } else if (err.message) {
        setFormError(err.message);
      } else {
        setFormError("Failed to send reset link. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setErrors([]);
    setFormError("");
    setStatus(null);
    setEmail("");
  };

  const hasErrors = errors.length > 0 || formError;
  const isSuccess = status !== null;

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

                <h1 className="text-2xl font-bold">
                  {isSuccess ? "Check Your Email" : "Forgot Password"}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {isSuccess
                    ? "We've sent a password reset link to your email address."
                    : "Input your email to get your password reset link"}
                </p>
              </div>

              {/* Success Message */}
              {status && (
                <div className="p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm">
                  {status}
                </div>
              )}

              {/* Form Error Message */}
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
                  {formError}
                </div>
              )}

              {/* Server Error Messages */}
              {hasErrors && errors.length > 0 && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
                  <ul className="space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {!isSuccess ? (
                <>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        // Clear errors when user starts typing
                        if (formError || errors.length > 0) {
                          setFormError("");
                          setErrors([]);
                        }
                      }}
                      required
                      disabled={isLoading}
                      className={
                        formError || errors.length > 0
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Get Reset Link"
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 text-center">
                      If you don't see the email in your inbox, please check
                      your spam folder.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleReset}
                    className="w-full bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] transition-all duration-200"
                  >
                    Try Another Email
                  </Button>
                </div>
              )}

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
