"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { usePaystackPayment } from "@/hooks/usePaystackPayment";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth";
import { fundWallet, verifyWalletFunding } from "@/queries/wallet";
import { Wallet, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 100, {
      message: "Minimum amount is ₦100",
    })
    .refine((val) => !isNaN(Number(val)) && Number(val) <= 2000000, {
      message: "Maximum amount is ₦2,000,000",
    }),
});

interface FundWalletFormProps {
  onSuccess?: (newBalance: number) => void;
  onClose?: () => void;
}

export default function FundWalletForm({
  onSuccess,
  onClose,
}: FundWalletFormProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.data?.email || "",
      amount: "",
    },
  });

  // Paystack payment hook
  const { startPayment } = usePaystackPayment();

  // Handle Paystack success
  const handlePaystackSuccess = async (response: any) => {
    console.log("Paystack payment successful:", response);
    setPaymentStatus("processing");

    try {
      // Verify and process the wallet funding
      const result = await verifyWalletFunding(response.reference);

      if (result.success) {
        setPaymentStatus("success");
        form.reset();

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(result.data.new_balance);
        }

        // Auto-close after 2 seconds if onClose provided
        if (onClose) {
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } else {
        setPaymentStatus("error");
        setErrorMessage(result.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Wallet funding error:", error);
      setPaymentStatus("error");
      setErrorMessage(
        "Failed to process wallet funding. Please contact support."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Paystack close
  const handlePaystackClose = () => {
    console.log("Payment modal closed");
    setIsProcessing(false);
    setPaymentStatus("idle");
  };

  // Handle form submission - UPDATED
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      setErrorMessage("Please log in to fund your wallet");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("idle");
    setErrorMessage("");

    try {
      const amount = Number(values.amount);

      // Start Paystack payment with wallet funding data structure
      startPayment(
        {
          email: values.email,
          amount: amount,
          metadata: {
            purpose: "wallet_funding",
            user_id: user.data.id,
          },
        },
        handlePaystackSuccess,
        handlePaystackClose
      );
    } catch (error) {
      console.error("Payment initiation error:", error);
      setPaymentStatus("error");
      setErrorMessage("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Authentication Required
        </h3>
        <p className="text-gray-600">Please log in to fund your wallet</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Fund Your Wallet</h2>
        <p className="text-gray-600 mt-2">
          Add money to your wallet for seamless payments
        </p>
      </div>

      {/* Payment Status Messages */}
      {paymentStatus === "success" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-800 font-medium">
              Payment Successful!
            </span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Your wallet has been funded successfully.
          </p>
        </div>
      )}

      {paymentStatus === "error" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-800 font-medium">Payment Failed</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
        </div>
      )}

      {paymentStatus === "processing" && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-blue-800 font-medium">
              Processing Payment
            </span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Verifying your payment and updating your wallet...
          </p>
        </div>
      )}

      {/* Funding Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your@email.com"
                    {...field}
                    disabled
                    className="bg-gray-50"
                  />
                </FormControl>
                <FormDescription>
                  This email will receive payment receipts
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₦)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₦
                    </span>
                    <Input
                      placeholder="1000"
                      {...field}
                      className="pl-8"
                      disabled={isProcessing}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter amount between ₦100 and ₦2,000,000
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <CreditCard className="w-4 h-4 mr-2" />
              <span>Secure Payment Powered by Paystack</span>
            </div>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Your payment information is encrypted and secure</li>
              <li>• Funds are added to your wallet instantly</li>
              <li>• Use wallet balance for dispatch rides and shopping</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a]"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay with Paystack
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
