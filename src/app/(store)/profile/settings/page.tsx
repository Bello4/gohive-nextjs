// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  UserProfile,
  AddressData,
  getUserProfile,
  updateAddress,
  initiatePhoneUpdate,
  verifyPhoneOTP,
  resendPhoneOTP,
} from "@/queries/user";
import Header from "@/components/home/layout/header/header";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"phone" | "address">("phone");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  // Phone update states
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Address states
  const [addressData, setAddressData] = useState<AddressData>({
    address: "",
    city: "",
    state: "",
    country: "",
    code: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const loadProfile = async () => {
    try {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      setPhone(userProfile.phone);
      setAddressData({
        address: userProfile.address || "",
        city: userProfile.city || "",
        state: userProfile.state || "",
        country: userProfile.country || "",
        code: userProfile.code || "",
      });
    } catch (error) {
      setMessage("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setUpdating(true);
    setMessage("");

    try {
      await initiatePhoneUpdate(phone);
      setOtpSent(true);
      setOtpCountdown(60); // 60 seconds countdown
      setMessage("OTP sent to your email and WhatsApp");
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setUpdating(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 4) return;

    setUpdating(true);
    setMessage("");

    try {
      const updatedProfile = await verifyPhoneOTP(otp);
      setProfile(updatedProfile);
      setOtpSent(false);
      setOtp("");
      setMessage("Phone number updated successfully!");
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Invalid OTP");
    } finally {
      setUpdating(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpCountdown > 0) return;

    setUpdating(true);
    setMessage("");

    try {
      await resendPhoneOTP();
      setOtpCountdown(60);
      setMessage("OTP resent successfully");
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Failed to resend OTP");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddressUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    setUpdating(true);
    setMessage("");

    try {
      const updatedProfile = await updateAddress(addressData);
      setProfile(updatedProfile);
      setMessage("Address updated successfully!");
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Failed to update address");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddressChange = (field: keyof AddressData, value: string) => {
    setAddressData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <>
        {/* <Header /> */}
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-md mx-auto p-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-md mx-auto p-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Update your contact information
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === "phone"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("phone")}
            >
              Phone Number
            </button>
            <button
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === "address"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("address")}
            >
              Address
            </button>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`p-3 rounded-lg mb-4 ${
                message.includes("Error") ||
                message.includes("Failed") ||
                message.includes("Invalid")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Phone Update Form */}
          {activeTab === "phone" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Update Phone Number
                </h2>

                {!otpSent ? (
                  <form onSubmit={handlePhoneUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={updating}
                      className="w-full  text-white py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updating ? "Sending OTP..." : "Send Verification OTP"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpVerify} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-lg tracking-widest"
                        placeholder="0000"
                        maxLength={6}
                        required
                      />
                      <p className="text-sm text-gray-600 mt-2 text-center">
                        Enter the 6-digit OTP sent to your email and WhatsApp
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={updating || otp.length !== 4}
                      className="w-full py-2 px-3 rounded-lg font-medium bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updating ? "Verifying..." : "Verify OTP"}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={otpCountdown > 0}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {otpCountdown > 0
                          ? `Resend OTP in ${otpCountdown}s`
                          : "Resend OTP"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Address Update Form */}
          {activeTab === "address" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Update Address
                </h2>

                <form onSubmit={handleAddressUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={addressData.address}
                      onChange={(e) =>
                        handleAddressChange("address", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={addressData.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="City"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={addressData.state}
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={addressData.country}
                        onChange={(e) =>
                          handleAddressChange("country", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Country"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={addressData.code}
                        onChange={(e) =>
                          handleAddressChange("code", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="ZIP Code"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full   py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updating ? "Updating..." : "Update Address"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
