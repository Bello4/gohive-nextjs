// src/queries/user.ts
import axios from "@/lib/axios";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  code: string;
}

export interface AddressData {
  address: string;
  city: string;
  state: string;
  country: string;
  code: string;
}

// Get user profile
export async function getUserProfile(): Promise<UserProfile> {
  const response = await axios.get("/api/v1/user/profile");
  return response.data.data;
}

// Update address
export async function updateAddress(data: AddressData): Promise<UserProfile> {
  const response = await axios.put("/api/v1/user/address", data);
  return response.data.data;
}

// Initiate phone update
export async function initiatePhoneUpdate(
  phone: string
): Promise<{ message: string; method: string }> {
  const response = await axios.post("/api/v1/user/phone/initiate", { phone });
  return response.data;
}

// Verify phone OTP
export async function verifyPhoneOTP(otp: string): Promise<UserProfile> {
  const response = await axios.post("/api/v1/user/phone/verify", { otp });
  return response.data.data;
}

// Resend phone OTP
export async function resendPhoneOTP(): Promise<{ message: string }> {
  const response = await axios.post("/api/v1/user/phone/resend-otp");
  return response.data;
}
