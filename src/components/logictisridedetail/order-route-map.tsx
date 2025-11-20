"use client";

import { OrderDetails } from "@/types/logistic";
import { MapPin, Navigation, Clock } from "lucide-react";

interface OrderRouteMapProps {
  order: OrderDetails;
}

export default function OrderRouteMap({ order }: OrderRouteMapProps) {
  // Safe number formatting
  const formatDistance = (value: number | undefined | null): string => {
    const numValue = value || 0;
    return `${numValue.toFixed(1)} km`;
  };

  const formatDuration = (value: number | undefined | null): string => {
    const numValue = value || 0;
    return `${numValue} min`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-md font-semibold text-gray-900 mb-4">
        Delivery Route
      </h2>

      {/* Map Placeholder - Replace with actual map implementation */}
      {/* <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4">
        <div className="text-center text-gray-500">
          <Navigation className="w-12 h-12 mx-auto mb-2 text-orange-500" />
          <p className="text-sm">Map View</p>
          <p className="text-xs mt-1">
            Interactive map would be displayed here
          </p>
        </div>
      </div> */}

      {/* Route Details */}
      <div className="space-y-3">
        {/* Pickup Location */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
            <MapPin className="w-3 h-3 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Pickup Location</p>
            <p className="text-sm text-gray-600 truncate">
              {order.locations.pickup.address || "Address not available"}
            </p>
          </div>
        </div>

        {/* Distance & Time */}
        <div className="flex items-center justify-between text-sm text-gray-600 px-2">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>
              {formatDuration(order.metrics.estimated_duration_minutes)}
            </span>
          </div>
          <div className="text-gray-400">•</div>
          <div>
            <span>{formatDistance(order.metrics.distance_km)}</span>
          </div>
        </div>

        {/* Dropoff Location */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
            <MapPin className="w-3 h-3 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Dropoff Location
            </p>
            <p className="text-sm text-gray-600 truncate">
              {order.locations.dropoff.address || "Address not available"}
            </p>
          </div>
        </div>
      </div>

      {/* Driver Location (if assigned and in transit) */}
      {order.driver && order.status === "in_transit" && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">Driver Location</p>
          <p className="text-sm text-blue-700">
            {order.driver.name} is currently en route to dropoff location
          </p>
        </div>
      )}
    </div>
  );
}
