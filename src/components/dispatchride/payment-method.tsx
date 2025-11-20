"use client";

import { useAuth } from "@/hooks/auth";

interface PaymentMethodProps {
  value: "wallet" | "paystack" | "delivery";
  onChange: (method: "wallet" | "paystack" | "delivery") => void;
}

export default function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  const { user } = useAuth();
  const balance = user?.data?.balance || 0;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const paymentMethods = [
    {
      id: "wallet" as const,
      name: "My Wallet",
      description: "Pay from your wallet balance",
      balance: formatCurrency(parseFloat(balance)),
      showBalance: true,
    },
    {
      id: "paystack" as const,
      name: "Paystack",
      description: "Pay with card or bank transfer",
      balance: "",
      showBalance: false,
    },
    {
      id: "delivery" as const,
      name: "Pay on Delivery",
      description: "Pay when package is delivered",
      balance: "",
      showBalance: false,
    },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">Payment Method</h3>

      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              value === method.id
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={value === method.id}
              onChange={(e) => onChange(e.target.value as any)}
              className="mt-1 text-orange-600 focus:ring-orange-500"
            />
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">{method.name}</div>
                  <div className="text-sm text-gray-500">
                    {method.description}
                  </div>
                </div>
                {method.showBalance && (
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      {method.balance}
                    </div>
                    <div className="text-xs text-gray-400">Available</div>
                  </div>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
