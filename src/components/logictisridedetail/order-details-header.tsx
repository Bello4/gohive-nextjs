"use client";

import { OrderDetails } from "@/types/logistic";
import { ArrowLeft, Phone, MessageCircle, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface OrderDetailsHeaderProps {
  order: OrderDetails;
}

export default function OrderDetailsHeader({ order }: OrderDetailsHeaderProps) {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      searching_driver: "bg-blue-100 text-blue-800",
      driver_assigned: "bg-purple-100 text-purple-800",
      picked_up: "bg-orange-100 text-orange-800",
      in_transit: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      failed: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    // Implement cancel order logic
    try {
      // await cancelOrder(order.id, "User requested cancellation");
      alert("Order cancellation requested");
      setShowActions(false);
    } catch (error) {
      alert("Failed to cancel order");
    }
  };

  const handleContactSupport = () => {
    // Implement contact support logic
    window.open(
      `tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+1234567890"}`
    );
  };

  return (
    <div className="bg-white shadow-sm border-b">
      {/* Header Bar */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Order Number */}
          <div className="text-center flex-1">
            <h1 className="text-md font-semibold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-sm text-gray-500">
              Created{" "}
              {new Date(order.timestamps.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {showActions && order.actions.can_cancel && (
              <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border py-2 z-10 min-w-[160px]">
                <button
                  onClick={handleCancelOrder}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  Cancel Order
                </button>
                <button
                  onClick={handleContactSupport}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4 flex items-center justify-between">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              order.status.current
            )}`}
          >
            {order.status.readable}
          </div>

          {/* Delivery Code */}
          {order.status.current !== "delivered" &&
            order.status.current !== "cancelled" && (
              <div className="text-sm text-gray-600">
                Code:{" "}
                <span className="font-mono font-semibold">
                  {order.delivery_code}
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
