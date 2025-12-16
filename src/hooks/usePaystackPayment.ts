import Paystack from "@paystack/inline-js";
import { OrderData } from "@/app/(store)/logistic/recieve/page";

// Types for different payment scenarios
interface WalletFundingData {
  email: string;
  amount: number;
  metadata?: {
    purpose: "wallet_funding";
    user_id?: number;
  };
}

interface OrderPaymentData extends OrderData {
  metadata?: {
    purpose: "dispatch_order";
    order_type?: string;
  };
}

type PaymentData = OrderPaymentData | WalletFundingData;

// Type guard to check if it's wallet funding
const isWalletFunding = (data: PaymentData): data is WalletFundingData => {
  return "amount" in data && !("pickup" in data);
};

// Type guard to check if it's order payment
const isOrderPayment = (data: PaymentData): data is OrderPaymentData => {
  return "pickup" in data && "sender" in data;
};

export const usePaystackPayment = () => {
  const startPayment = (
    data: PaymentData,
    onSuccess: (response: any) => void,
    onClose: () => void
  ) => {
    if (!data) {
      console.error("No payment data available");
      return;
    }

    if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
      console.error("Paystack public key not configured");
      return;
    }

    try {
      // Determine payment type and calculate amount
      let email: string;
      let amount: number;
      let reference: string;
      let metadata: any = {};

      if (isWalletFunding(data)) {
        // Wallet funding payment
        email = data.email;
        amount = data.amount * 100; // Convert to kobo
        reference = `WL-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        metadata = {
          ...data.metadata,
          custom_fields: [
            {
              display_name: "Payment Purpose",
              variable_name: "payment_purpose",
              value: "wallet_funding",
            },
          ],
        };
      } else if (isOrderPayment(data)) {
        // Order payment
        email = data.sender.email;

        // Calculate order total amount
        const deliveryFee = Math.max(data.distance * 400, 1000);
        const insuranceFee = data.insurance
          ? (data.package.value || 0) * 0.02
          : 0;
        const serviceCharge = deliveryFee * 0.1;
        const totalAmount = deliveryFee + insuranceFee + serviceCharge;

        amount = totalAmount * 100; // Convert to kobo
        reference = `DR-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        metadata = {
          ...data.metadata,
          custom_fields: [
            {
              display_name: "Payment Purpose",
              variable_name: "payment_purpose",
              value: "dispatch_order",
            },
            {
              display_name: "Order Type",
              variable_name: "order_type",
              value: data.metadata?.order_type || "instant",
            },
          ],
        };
      } else {
        console.error("Invalid payment data structure");
        return;
      }

      // Initialize Paystack checkout
      const paystack = new Paystack();

      paystack.checkout({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: email,
        amount: amount,
        ref: reference,
        metadata: metadata,
        currency: "NGN",

        // Handle successful transaction
        onSuccess: (response: any) => {
          console.log("Payment successful:", response);
          onSuccess(response);
        },

        // Handle modal load
        onLoad: () => {
          console.log("Paystack modal loaded");
        },

        // Handle modal close/cancel
        onCancel: () => {
          console.log("Payment cancelled by user");
          onClose();
        },

        // Handle errors
        onError: (error: any) => {
          // console.error("Paystack error:", error);
          // You might want to call onClose here too, or a separate error handler
          onClose();
        },
      });
    } catch (error) {
      console.error("Error initializing Paystack payment:", error);
      onClose();
    }
  };

  return { startPayment };
};
