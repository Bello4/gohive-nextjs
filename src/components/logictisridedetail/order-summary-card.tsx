"use client";

import { OrderDetails } from "@/types/logistic";
import { Package, Shield, CreditCard } from "lucide-react";

interface OrderSummaryCardProps {
  order: OrderDetails;
}

// Safe number formatting
const formatCurrency = (value: number): string => {
  return `₦${value.toLocaleString()}`;
};

const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

export default function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-md font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-4">
        {/* Package Details */}
        <div className="flex items-start space-x-3">
          <Package className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">Package Details</p>
            <div className="mt-1 text-sm text-gray-600 space-y-1">
              <p>
                Category:{" "}
                <span className="capitalize">{order.package.category}</span>
              </p>
              {order.package.description && (
                <p>Description: {order.package.description}</p>
              )}
              {order.package.fragile && (
                <p className="text-orange-600">⚠️ Fragile Item</p>
              )}
              {order.package.express && (
                <p className="text-blue-600">⚡ Express Delivery</p>
              )}
            </div>
          </div>
        </div>

        {/* Insurance */}
        {order.insurance.applied && (
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Insurance</p>
              <p className="text-sm text-gray-600 mt-1">
                Package insured for {formatCurrency(order.package.value)}
              </p>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="flex items-start space-x-3">
          <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">Payment</p>
            <div className="mt-1 text-sm text-gray-600">
              <p className="capitalize">
                {order.payment.method.replace("_", " ")}
              </p>
              <p
                className={`text-xs ${
                  order.payment.status === "paid"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                ●{" "}
                {order.payment.status.charAt(0).toUpperCase() +
                  order.payment.status.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="border-t pt-4 mt-4">
          <p className="font-medium text-gray-900 mb-3">Pricing Breakdown</p>
          <div className="space-y-2 text-sm">
            {/* <div className="flex justify-between">
              <span className="text-gray-600">Base Fare</span>
              <span className="text-gray-900">
                {formatCurrency(order.pricing.base_fare)}
              </span>
            </div> */}
            <div className="flex justify-between">
              <span className="text-gray-600">
                Distance Fare ({formatNumber(order.metrics.distance_km)} km)
              </span>
              <span className="text-gray-900">
                {formatCurrency(order.pricing.distance_fare)}
              </span>
            </div>
            {order.insurance.applied && (
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance Fee</span>
                <span className="text-gray-900">
                  {formatCurrency(order.pricing.insurance_fee)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Service Charge</span>
              <span className="text-gray-900">
                {formatCurrency(order.pricing.service_charge)}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-gray-900">
              <span>Total Amount</span>
              <span className="text-orange-600">
                {formatCurrency(order.pricing.total_amount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
