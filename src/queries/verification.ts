import axios from "@/lib/axios";

export interface VerifyResponse {
  status: boolean | string;
  errors?: string[];
}

export interface ResendResponse {
  status: string;
  message?: string;
}

/**
 * Verify OTP code
 */
export async function verifyCode(code: string): Promise<VerifyResponse> {
  const response = await axios.post("/api/v1/verify", { code });
  return response.data;
}

/**
 * Resend verification code
 */
export async function resendVerificationCode(): Promise<ResendResponse> {
  const response = await axios.post("/api/v1/resend-verification");
  return response.data;
}
