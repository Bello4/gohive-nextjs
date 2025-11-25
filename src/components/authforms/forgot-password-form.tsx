"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/auth"; // Adjust the path to your useAuth hook

// Logo image
import LogoImg from "../../../public/assets/icons/logo-small.png";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string[] }>({});
  const [status, setStatus] = useState<string | null>(null);

  const { forgotPassword } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrors({ email: ["Please enter your email address"] });
      return;
    }

    // Clear previous errors and status
    setErrors({});
    setStatus(null);

    // Call the forgotPassword function from useAuth hook
    await forgotPassword({
      setErrors,
      setStatus,
      email,
    });
  };

  const handleReset = () => {
    setErrors({});
    setStatus(null);
    setEmail("");
  };

  const hasErrors = Object.keys(errors).length > 0;
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

              {/* Error Messages */}
              {hasErrors && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
                  {Object.values(errors)
                    .flat()
                    .map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
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
                        if (errors.email) {
                          setErrors({});
                        }
                      }}
                      required
                      className={
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {errors.email && (
                      <div className="text-red-500 text-sm">
                        {errors.email[0]}
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Get Reset Link
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 text-center">
                      If you dont see the email in your inbox, please check your
                      spam folder.
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
