"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Phone, RotateCcw } from "lucide-react";
import { showToast } from "nextjs-toast-notify";
import { useAuth } from "@/hooks/auth";

import {
  verifyCode,
  resendVerificationCode,
  VerifyResponse,
} from "@/queries/verification";

export default function VerifyPage() {
  const { user, isAuthenticated, needsVerification } = useAuth({
    middleware: "auth", // Requires auth to access
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    // If user is already verified, redirect home
    if (user && !needsVerification) {
      router.push("/");
    }
  }, [user, needsVerification, router]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get user info from query params or context
  useEffect(() => {
    const email = searchParams.get("email") || "";
    const phone = searchParams.get("phone") || "";
    setUserEmail(email);
    setUserPhone(phone);
  }, [searchParams]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 4).split("");
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 4) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);

      // Focus last input
      const lastIndex = Math.min(index + pastedCode.length - 1, 3);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    // Single character input
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const verificationCode = code.join("");

    if (verificationCode.length !== 4) {
      showToast.error("Please enter the complete 4-digit code", {
        duration: 3000,
        position: "bottom-right",
      });
      return;
    }

    if (!/^\d+$/.test(verificationCode)) {
      showToast.error("Please enter numbers only", {
        duration: 3000,
        position: "bottom-right",
      });
      return;
    }

    setIsLoading(true);

    try {
      const data: VerifyResponse = await verifyCode(verificationCode);

      if (data.status === "success" || data.status === true) {
        showToast.success("Verification successful! Redirecting...", {
          duration: 3000,
          position: "bottom-right",
        });

        // Redirect to dashboard after successful verification
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        showToast.error(data.errors?.[0] || "Verification failed", {
          duration: 3000,
          position: "bottom-right",
        });

        // Clear inputs on error
        setCode(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      console.error("Verification error:", error);

      // Handle specific error cases
      if (error.response?.data?.errors) {
        showToast.error(
          error.response.data.errors[0] || "Verification failed",
          {
            duration: 3000,
            position: "bottom-right",
          }
        );
      } else {
        showToast.error("Network error. Please try again.", {
          duration: 3000,
          position: "bottom-right",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsResending(true);

    try {
      const data = await resendVerificationCode();

      if (data.status === "success") {
        showToast.success("Verification code sent successfully!", {
          duration: 3000,
          position: "bottom-right",
        });
        setCountdown(60); // 60 seconds countdown
      } else {
        showToast.error(data.message || "Failed to resend code", {
          duration: 3000,
          position: "bottom-right",
        });
      }
    } catch (error: any) {
      console.error("Resend error:", error);

      if (error.response?.data?.message) {
        showToast.error(error.response.data.message, {
          duration: 3000,
          position: "bottom-right",
        });
      } else {
        showToast.error("Network error. Please try again.", {
          duration: 3000,
          position: "bottom-right",
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  const formatPhone = (phone: string) => {
    // Format phone for display
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Verify Your Account
          </CardTitle>
          <CardDescription>
            Enter the 4-digit code sent to your email and WhatsApp
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Contact Info */}
          <div className="space-y-3">
            {userEmail && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{userEmail}</span>
              </div>
            )}
            {userPhone && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{formatPhone(userPhone)}</span>
              </div>
            )}
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium">
                Verification Code
              </Label>

              <div className="flex justify-center space-x-2">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLoading}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <p className="text-xs text-gray-500 text-center">
                Enter the 4-digit code from your email and WhatsApp
              </p>
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={isLoading || code.join("").length !== 4}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </Button>
          </form>

          {/* Resend Code Section */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the code?
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Resend Code
                </>
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>The code expires in 5 minutes</p>
            <p>Check both your email and WhatsApp messages</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
