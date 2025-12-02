"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import DispatchRideForm from "@/components/dispatchride/main-dispatch-ride-form";
import OrderSummaryModal from "@/components/dispatchride/order-summary-modal";
import Header from "@/components/home/layout/header/header";
import { createDispatchRide } from "@/queries/dispatch";
import MobileApp from "@/components/home/layout/footer/mobile-nav";
import { usePaystackPayment } from "@/hooks/usePaystackPayment";

export interface PackageDetails {
  category: string;
  description?: string;
  value?: number;
}

export interface SenderDetails {
  name: string;
  phone: string;
  email: string;
  useAuthInfo: boolean;
}

export interface ReceiverDetails {
  name: string;
  phone: string;
  email: string;
  useAuthInfo: boolean;
}

export interface OrderData {
  pickup: {
    address: string;
    lat: number;
    lng: number;
  };
  dropoff: {
    address: string;
    lat: number;
    lng: number;
  };
  sender: SenderDetails;
  receiver: ReceiverDetails;
  package: PackageDetails;
  paymentMethod: "wallet" | "paystack" | "delivery";
  insurance: boolean;
  distance: number;
  duration: number;
}

export default function DispatchRidePage() {
  const [showSummary, setShowSummary] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Initialize paystack hook
  const { startPayment } = usePaystackPayment();

  const handleConfirmOrder = useCallback((data: OrderData) => {
    setOrderData(data);
    setShowSummary(true);
    setSubmitError(null);
  }, []);

  const router = useRouter();
  // Paystack payment success handler
  const handlePaystackSuccess = useCallback(
    async (response: any) => {
      console.log("Paystack payment successful:", response);

      if (!orderData) return;

      // Now send the order to backend with payment reference
      await submitOrderToBackend(response.reference);
    },
    [orderData]
  );
  // Paystack payment close handler
  const handlePaystackClose = useCallback(() => {
    console.log("Payment modal closed");
    setSubmitError("Payment was cancelled. Please try again.");
    setIsSubmitting(false);
  }, []);

  const submitOrderToBackend = useCallback(
    async (paymentReference?: string) => {
      if (!orderData) return;

      try {
        console.log("Submitting order to backend...");

        const response = await createDispatchRide({
          ...orderData,
          paymentReference,
        });

        if (response.success) {
          console.log("Order created successfully:", response.data);

          // Show success message
          alert(
            `Order created successfully! Your order number is: ${response.data.order_number}`
          );

          // Close modal
          setShowSummary(false);

          // Redirect to order tracking page
          router.push(`/logistic/order/${response.data.id}`);
        } else {
          throw new Error(response.message || "Failed to create order");
        }
      } catch (error) {
        console.error("Error creating order:", error);
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Failed to create order. Please try again."
        );

        // If Paystack payment was successful but backend failed, you might want to refund
        if (paymentReference) {
          console.warn(
            "Payment was successful but order creation failed. Payment reference:",
            paymentReference
          );
          // You might want to call a refund API here
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [orderData, router]
  );

  const handlePayment = useCallback(async () => {
    if (!orderData) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      switch (orderData.paymentMethod) {
        case "paystack":
          // Start Paystack payment process
          startPayment(orderData, handlePaystackSuccess, handlePaystackClose);
          break;

        case "wallet":
        case "delivery":
          // Process directly without payment verification
          await submitOrderToBackend();
          break;

        default:
          throw new Error("Unsupported payment method");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setSubmitError(error instanceof Error ? error.message : "Payment failed");
      setIsSubmitting(false);
    }
  }, [
    orderData,
    startPayment,
    handlePaystackSuccess,
    handlePaystackClose,
    submitOrderToBackend,
  ]);

  const handlePlaceOrder = useCallback(async () => {
    await handlePayment();
  }, [handlePayment]);

  const { user } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Schedule a delivery ride for your package
            </p>
          </div>

          <DispatchRideForm user={user} onConfirm={handleConfirmOrder} />

          {showSummary && orderData && (
            <OrderSummaryModal
              orderData={orderData}
              onClose={() => setShowSummary(false)}
              onConfirm={handlePlaceOrder}
              isSubmitting={isSubmitting}
              error={submitError}
            />
          )}
        </div>
      </div>

      <div className="mt-10" />

      <MobileApp />
    </>
  );
}
