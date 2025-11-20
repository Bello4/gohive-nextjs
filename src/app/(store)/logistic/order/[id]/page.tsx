"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOrderDetails } from "@/queries/logistics";
import OrderDetailsHeader from "@/components/logictisridedetail/order-details-header";
import OrderProgressTimeline from "@/components/logictisridedetail/order-progress-timeline";
import OrderRouteMap from "@/components/logictisridedetail/order-route-map";
import OrderSummaryCard from "@/components/logictisridedetail/order-summary-card";
import ContactDetailsCard from "@/components/logictisridedetail/contact-details-card";
import { OrderDetails } from "@/types/logistic";

interface Props {
  params: { id: string };
}

export default function OrderDetailsPage({ params }: Props) {
  const router = useRouter();
  const orderId = parseInt(params.id);

  if (isNaN(orderId)) {
    return <OrderErrorState error="Invalid order ID" />;
  }

  return <OrderDetailsContent orderId={orderId} />;
}

function OrderDetailsContent({ orderId }: { orderId: number }) {
  const { data: order, isLoading, error } = useOrderDetails(orderId);

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (error || !order?.data) {
    return <OrderErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <OrderDetailsHeader order={order.data} />

      <div className="max-w-md mx-auto px-4 space-y-6 py-6">
        {/* Progress Timeline */}
        <OrderProgressTimeline order={order.data} />

        {/* Optional: Route Map - Comment out if not needed */}
        <OrderRouteMap order={order.data} />

        {/* Order Summary */}
        <OrderSummaryCard order={order.data} />

        {/* Contact Details */}
        <ContactDetailsCard order={order.data} />
      </div>
    </div>
  );
}

// Custom hook for order details
function useOrderDetails(orderId: number) {
  const [data, setData] = useState<{ data: OrderDetails } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const orderData = await getOrderDetails(orderId);
        setData(orderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { data, isLoading, error };
}

function OrderDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderErrorState({ error }: { error: string | null }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-orange-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Order Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          {error ||
            "The order you're looking for doesn't exist or you don't have permission to view it."}
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
