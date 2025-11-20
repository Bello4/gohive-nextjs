"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/home/layout/header/header";
import Loading from "@/components/shared/loading";
import Link from "next/link";
import ErrorComponent from "@/components/shared/error-component";

// Types
interface Order {
  id: number;
  orderNumber: string;
  status: {
    readable: string;
  };
  status_readable: string;
  locations: {
    pickup: {
      address: string;
    };
    dropoff: {
      address: string;
    };
  };
  dropoff_address: string;
  pricing: {
    total_amount: string;
  };
  timestamps: {
    created_at: string;
  };
  driver?: {
    name: string;
    phone: string;
  };
}

interface OrderStats {
  all: number;
  active: number;
  delivered: number;
  cancelled: number;
}

// Skeleton Loading Component
function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Order Card Component
function OrderCard({ order }: { order: Order }) {
  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      ACCEPTED: "bg-blue-100 text-blue-800",
      IN_PROGRESS: "bg-orange-100 text-orange-800",
      IN_TRANSIT: "bg-purple-100 text-purple-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-orange-500">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm text-gray-500">Order #</p>
            <p className="font-semibold text-md">{order.orderNumber}</p>
          </div>
          <Badge
            className={`${getStatusColor(order.status.readable)} font-medium`}
          >
            {order.status.readable}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {order.locations.pickup.address}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {order.locations.dropoff.address}
            </p>
          </div>
        </div>

        {order.driver && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Driver</p>
            <p className="text-sm font-medium">{order.driver.name}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t">
          <p className="text-sm text-gray-500">
            {formatDate(order.timestamps.created_at)}
          </p>
          <p className="font-bold text-orange-600">
            {formatCurrency(order.pricing.total_amount)}
          </p>
        </div>

        <Link href={`/logistic/order/${order.id}`} className="block">
          <Button className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white">
            Track Order
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Main Orders Page Component
export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState<OrderStats>({
    all: 0,
    active: 0,
    delivered: 0,
    cancelled: 0,
  });

  // Fetch order statistics
  const { data: statsData } = useSWR("/api/v1/orders/stats", fetcher);

  // Fetch orders based on active tab
  const {
    data: ordersData,
    error: ordersError,
    isLoading: ordersLoading,
    mutate: refetchOrders,
  } = useSWR(`/api/v1/orders?status=${activeTab}`, fetcher, {
    revalidateOnFocus: false,
  });

  // Update stats when data is fetched
  useEffect(() => {
    if (statsData?.data) {
      setStats(statsData.data);
    }
  }, [statsData]);

  if (ordersError) {
    return (
      <div className="min-h-screen">
        <ErrorComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-4 max-w-4xl mx-auto">
        {/* Stats Overview */}

        {/* Tabs Filter */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All ({stats.all})
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs sm:text-sm">
              Active ({stats.active})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs sm:text-sm">
              Delivered ({stats.delivered})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs sm:text-sm">
              Cancelled ({stats.cancelled})
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="all" className="mt-0">
            {ordersLoading ? (
              <OrderSkeleton />
            ) : (
              <div className="space-y-4">
                {ordersData?.data?.map((order: Order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {ordersData?.data?.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">No orders found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            {ordersLoading ? (
              <OrderSkeleton />
            ) : (
              <div className="space-y-4">
                {ordersData?.data?.map((order: Order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {ordersData?.data?.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">No active orders</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="delivered" className="mt-0">
            {ordersLoading ? (
              <OrderSkeleton />
            ) : (
              <div className="space-y-4">
                {ordersData?.data?.map((order: Order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {ordersData?.data?.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">No delivered orders</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="mt-0">
            {ordersLoading ? (
              <OrderSkeleton />
            ) : (
              <div className="space-y-4">
                {ordersData?.data?.map((order: Order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {ordersData?.data?.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">No cancelled orders</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
