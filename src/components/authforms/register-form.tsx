"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth"; // Updated import
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PhoneInput from "react-phone-number-input/input";
import { Loader2, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";

// Logo image
import LogoImg from "../../../public/assets/icons/logo-small.png";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  // Check if useAuth exists
  let authHook;
  try {
    authHook = useAuth({
      middleware: "guest",
      redirectIfAuthenticated: "/",
    });
  } catch (error) {
    console.error("useAuth hook not found:", error);
  }

  const { register, isLoading: authLoading } = authHook || {};

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  }>({});
  const [status, setStatus] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Handle URL parameters for status messages
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get("success");

    if (successParam) {
      try {
        const decodedMessage = atob(successParam);
        setStatus(decodedMessage);

        // Clear the URL parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      } catch (error) {
        console.error("Failed to decode success message:", error);
      }
    }
  }, []);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation function
  const validatePhone = (phone: string): boolean => {
    // Remove non-digits for validation
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
    } = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and numbers";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if register function exists
    if (!register) {
      setApiError("Registration service unavailable. Please refresh the page.");
      return;
    }

    // Clear previous errors
    setApiError(null);
    setErrors([]);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call register function - token-based doesn't need setErrors/setStatus
      const result = await register({
        name,
        email,
        phone,
        password,
      });

      console.log("Registration successful:", result);

      // Check if we got a token
      if (result?.access_token || result?.data?.access_token) {
        // Success - store token is handled in the hook

        // Check if verification is required
        if (
          result.requires_verification ||
          result?.data?.requires_verification
        ) {
          const userData = result.user || result.data?.user;
          if (userData) {
            router.push(
              `/verify?email=${encodeURIComponent(
                userData.email
              )}&phone=${encodeURIComponent(userData.phone)}`
            );
          } else {
            router.push("/verify");
          }
        } else {
          // Auto-logged in, redirect to home
          router.push("/");
        }
      } else {
        // Handle case where registration succeeded but no token returned
        setStatus(
          "Registration successful! Please check your email for verification."
        );

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Registration failed:", err);

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
        setApiError(err.response.data.message);
      } else if (err.message) {
        setApiError(err.message);
      } else {
        setApiError("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real-time validation handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (formErrors.name && value.trim().length >= 2) {
      setFormErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (formErrors.email && validateEmail(value)) {
      setFormErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePhoneChange = (value: string = "") => {
    setPhone(value);
    if (formErrors.phone && validatePhone(value)) {
      setFormErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (formErrors.password && value.length >= 8) {
      setFormErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isLoading = isSubmitting || authLoading;

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
                <h1 className="text-2xl font-bold">Welcome to HiveGO</h1>
                <p className="text-muted-foreground text-balance">
                  Register to Get Started
                </p>
              </div>

              {/* Name Field */}
              <div className="grid gap-3">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={handleNameChange}
                    required
                    disabled={isLoading}
                    className={`pl-10 ${
                      formErrors.name
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {formErrors.name && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span>•</span>
                    {formErrors.name}
                  </p>
                )}
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

              {/* Phone Field */}
              <div className="grid gap-3">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <PhoneInput
                    country="NG"
                    value={phone}
                    onChange={handlePhoneChange}
                    international
                    withCountryCallingCode
                    disabled={isLoading}
                    className={`w-full h-11 rounded-md pl-10 pr-3 text-sm border bg-background placeholder:text-muted-foreground ${
                      formErrors.phone
                        ? "border-red-500 focus:border-red-500"
                        : "border-input"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span>•</span>
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
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
                    placeholder="Password"
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
                {!formErrors.password && password && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className={password.length >= 8 ? "text-green-600" : ""}>
                      • At least 8 characters {password.length >= 8 ? "✓" : ""}
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
                disabled={isLoading || !register}
                className="w-full bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Register Now"
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Login Here
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

      {/* Terms and Privacy */}
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
