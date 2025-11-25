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
import { useAuth } from "@/hooks/auth";
import { useParams, useSearchParams } from "next/navigation";

// Logo image
import LogoImg from "../../../public/assets/icons/logo-small.png";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
    token?: string[];
  }>({});
  const [status, setStatus] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors and status
    setErrors({});
    setStatus(null);

    if (!token) {
      setErrors({ token: ["Reset token is missing"] });
      return;
    }

    // Call the resetPassword function from useAuth hook
    await resetPassword({
      setErrors,
      setStatus,
      email,
      password,
      password_confirmation: passwordConfirmation,
      token: token,
    });
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
                    className={
                      errors.email ? "border-red-500 focus:border-red-500" : ""
                    }
                  />
                  {errors.email && (
                    <div className="text-red-500 text-sm">
                      {errors.email[0]}
                    </div>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                  />
                  {errors.password && (
                    <div className="text-red-500 text-sm">
                      {errors.password[0]}
                    </div>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="passwordConfirmation">
                    Confirm New Password
                  </Label>
                  <Input
                    id="passwordConfirmation"
                    type="password"
                    placeholder="Confirm your new password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    className={
                      errors.password_confirmation
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                  />
                  {errors.password_confirmation && (
                    <div className="text-red-500 text-sm">
                      {errors.password_confirmation[0]}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={!token}
                className="w-full bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {!token ? "Loading..." : "Reset Password"}
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
