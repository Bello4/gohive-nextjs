"use client";

import { OrderDetails } from "@/types/logistic";
import { Check, Clock, Package, Truck, User, MapPin } from "lucide-react";

interface OrderProgressTimelineProps {
  order: OrderDetails;
}

export default function OrderProgressTimeline({
  order,
}: OrderProgressTimelineProps) {
  const timelineSteps = [
    {
      key: "pending",
      icon: Clock,
      title: "Order Placed",
      description: "Your order has been received",
      status: "pending",
      timestampField: "created_at" as const,
    },
    {
      key: "driver_assigned",
      icon: User,
      title: "Driver Assigned",
      description: "A driver has been assigned to your order",
      status: "driver_assigned",
      timestampField: "driver_assigned_at" as const,
    },
    {
      key: "picked_up",
      icon: Package,
      title: "Package Picked Up",
      description: "Driver has picked up your package",
      status: "picked_up",
      timestampField: "picked_up_at" as const,
    },
    {
      key: "in_transit",
      icon: Truck,
      title: "In Transit",
      description: "Package is on the way to destination",
      status: "in_transit",
      timestampField: undefined,
    },
    {
      key: "delivered",
      icon: MapPin,
      title: "Delivered",
      description: "Package has been delivered successfully",
      status: "delivered",
      timestampField: "delivered_at" as const,
    },
  ];

  const getStepStatus = (stepStatus: string, currentStatus: string) => {
    const statusOrder = [
      "pending",
      "searching_driver",
      "driver_assigned",
      "picked_up",
      "in_transit",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  const currentStepIndex = timelineSteps.findIndex(
    (step) => step.status === order.status.current
  );

  // Safe timestamp access
  const getTimestamp = (timestampField: string | undefined) => {
    if (!timestampField) return null;
    return order.timestamps[timestampField as keyof typeof order.timestamps];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-md font-semibold text-gray-900 mb-6">
        Delivery Progress
      </h2>

      <div className="space-y-1">
        {timelineSteps.map((step, index) => {
          const stepStatus = getStepStatus(step.status, order.status.current);
          const Icon = step.icon;
          const isCompleted = stepStatus === "completed";
          const isCurrent = stepStatus === "current";
          const isUpcoming = stepStatus === "upcoming";
          const timestamp = getTimestamp(step.timestampField);

          return (
            <div key={step.key} className="flex items-start space-x-2 relative">
              {/* Timeline Line */}
              {index < timelineSteps.length - 1 && (
                <div
                  className={`absolute left-4 mt-8 w-0.5 h-8 ${
                    isCompleted ? "bg-orange-500" : "bg-gray-200"
                  }`}
                />
              )}

              {/* Icon */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isCompleted
                    ? "bg-orange-500 border-orange-500 text-white"
                    : isCurrent
                    ? "bg-orange-50 border-orange-500 text-orange-500"
                    : "bg-gray-50 border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-medium ${
                    isCompleted || isCurrent ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm ${
                    isCompleted || isCurrent ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>

                {/* Timestamp */}
                {timestamp && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(timestamp).toLocaleString()}
                  </p>
                )}

                {/* Current Status Info */}
                {isCurrent &&
                  order.driver &&
                  step.status === "driver_assigned" && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>{order.driver.name}</strong> is assigned to your
                        delivery
                        {order.driver.vehicle_type && (
                          <span> with {order.driver.vehicle_type}</span>
                        )}
                      </p>
                      {order.driver.phone && (
                        <p className="text-sm text-blue-700 mt-1">
                          Contact: {order.driver.phone}
                        </p>
                      )}
                    </div>
                  )}

                {isCurrent && step.status === "in_transit" && (
                  <div className="mt-2 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      Your package is on the way to the destination
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      Estimated delivery:{" "}
                      {order.metrics.estimated_duration_minutes} min
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      {currentStepIndex >= 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>
              {Math.round(
                ((currentStepIndex + 1) / timelineSteps.length) * 100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((currentStepIndex + 1) / timelineSteps.length) * 100
                }%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
