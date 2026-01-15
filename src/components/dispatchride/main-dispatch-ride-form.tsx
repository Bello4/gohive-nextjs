"use client";

import { useState } from "react";
import LocationSearch from "./location-search";
import SenderDetailsForm from "./sender-details-form";
import ReceiverDetailsForm from "./reciever-details-form";
import PackageDetailsForm from "./package-details-form";
import PaymentMethod from "./payment-method";
import InsuranceToggle from "./insurance-toggle";
import {
  OrderData,
  SenderDetails,
  ReceiverDetails,
  PackageDetails,
} from "@/app/(store)/logistic/recieve/page";

interface DispatchRideFormProps {
  user: any;
  onConfirm: (data: OrderData) => void;
}

interface Location {
  address: string;
  lat: number;
  lng: number;
}

export default function DispatchRideForm({
  user,
  onConfirm,
}: DispatchRideFormProps) {
  const [step, setStep] = useState(1);
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);

  const [senderDetails, setSenderDetails] = useState<SenderDetails>({
    name: user?.data?.name || "",
    phone: user?.data?.phone || "",
    email: user?.data?.email || "",
    useAuthInfo: !!user,
  });
  const [receiverDetails, setReceiverDetails] = useState<ReceiverDetails>({
    name: user?.data?.name || "",
    phone: user?.data?.phone || "",
    email: user?.data?.email || "",
    useAuthInfo: !!user,
  });
  const [packageDetails, setPackageDetails] = useState<PackageDetails>({
    category: "",
    description: "",
    value: 0,
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
  });
  const [paymentMethod, setPaymentMethod] = useState<
    "wallet" | "paystack" | "delivery"
  >("wallet");
  const [insurance, setInsurance] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateDistance = async (origin: Location, destination: Location) => {
    try {
      setIsCalculating(true);

      // Check if Google Maps is loaded
      if (!window.google || !window.google.maps) {
        console.error("Google Maps not loaded");
        return { distance: 0, duration: 0 };
      }

      const service = new google.maps.DistanceMatrixService();

      const response = await service.getDistanceMatrix({
        origins: [
          {
            lat: origin.lat,
            lng: origin.lng,
          },
        ],
        destinations: [
          {
            lat: destination.lat,
            lng: destination.lng,
          },
        ],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      });

      console.log("Distance Matrix Response:", response);

      const element = response.rows[0].elements[0];

      if (element.status === "OK") {
        const dist = element.distance.value / 1000; // Convert to km
        const dur = element.duration.value / 60; // Convert to minutes

        console.log(`Distance: ${dist} km, Duration: ${dur} min`);

        setDistance(dist);
        setDuration(dur);
        return { distance: dist, duration: dur };
      } else {
        console.error("Distance calculation failed:", element.status);
        // Fallback: Calculate straight-line distance
        const fallbackDistance = calculateStraightLineDistance(
          origin,
          destination
        );
        const fallbackDuration = fallbackDistance * 2; // Estimate 2 min per km
        setDistance(fallbackDistance);
        setDuration(fallbackDuration);
        return { distance: fallbackDistance, duration: fallbackDuration };
      }
    } catch (error) {
      console.error("Error calculating distance:", error);
      // Fallback calculation
      if (pickupLocation && dropoffLocation) {
        const fallbackDistance = calculateStraightLineDistance(
          pickupLocation,
          dropoffLocation
        );
        const fallbackDuration = fallbackDistance * 2;
        setDistance(fallbackDistance);
        setDuration(fallbackDuration);
      }
      return { distance: 0, duration: 0 };
    } finally {
      setIsCalculating(false);
    }
  };

  // Fallback straight-line distance calculation using Haversine formula
  const calculateStraightLineDistance = (
    origin: Location,
    destination: Location
  ) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
    const dLng = ((destination.lng - origin.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((origin.lat * Math.PI) / 180) *
        Math.cos((destination.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const handlePickupSelect = async (place: any) => {
    const location: Location = {
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setPickupLocation(location);
    if (dropoffLocation) {
      await calculateDistance(location, dropoffLocation);
    }
  };

  const handleDropoffSelect = async (place: any) => {
    const location: Location = {
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setDropoffLocation(location);
    if (pickupLocation) {
      await calculateDistance(pickupLocation, location);
    }
  };

  const handleConfirm = () => {
    if (!pickupLocation || !dropoffLocation) {
      alert("Please select both pickup and dropoff locations");
      return;
    }

    // Validate insurance value if insurance is applied
    if (insurance && (!packageDetails.value || packageDetails.value <= 0)) {
      alert("Please enter a valid item value for insurance coverage");
      return;
    }

    const orderData: OrderData = {
      pickup: pickupLocation,
      dropoff: dropoffLocation,
      sender: senderDetails,
      receiver: receiverDetails,
      package: packageDetails,
      paymentMethod,
      insurance,
      distance,
      duration,
    };

    onConfirm(orderData);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Location</span>
          <span>Details</span>
          <span>Package</span>
          <span>Payment</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] h-1 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Locations */}
      {step === 1 && (
        <div className="space-y-6">
          <LocationSearch
            label="Pickup Location"
            onPlaceSelect={handlePickupSelect}
          />
          <LocationSearch
            label="Dropoff Location"
            onPlaceSelect={handleDropoffSelect}
          />

          {isCalculating && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Calculating distance...
              </p>
            </div>
          )}

          {distance > 0 && !isCalculating && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                📍 Distance: {distance.toFixed(1)} km • ⏱️ Est. time:{" "}
                {Math.ceil(duration)} min
              </p>
              <p className="text-xs text-green-600 mt-1">
                Delivery fee: ₦{Math.max(distance * 200, 1000).toFixed(0)}
              </p>
            </div>
          )}

          <button
            onClick={nextStep}
            disabled={!pickupLocation || !dropoffLocation || isCalculating}
            className="w-full text-sm bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white py-2 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isCalculating ? "Calculating..." : "Continue to Details"}
          </button>
        </div>
      )}

      {/* Rest of the component remains the same */}
      {/* Step 2: Sender & Receiver Details */}
      {step === 2 && (
        <div className="space-y-6">
          <SenderDetailsForm
            details={senderDetails}
            onChange={setSenderDetails}
            user={user}
          />
          <ReceiverDetailsForm
            details={receiverDetails}
            onChange={setReceiverDetails}
            user={user}
          />

          <div className="flex gap-3">
            <button
              onClick={prevStep}
              className="flex-1 border text-sm border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="flex-1 text-sm bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Continue to Package
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Package Details */}
      {step === 3 && (
        <div className="space-y-6">
          <PackageDetailsForm
            details={packageDetails}
            onChange={setPackageDetails}
            insuranceApplied={insurance} // Add this prop
          />
          <InsuranceToggle value={insurance} onChange={setInsurance} />

          <div className="flex gap-3">
            <button
              onClick={prevStep}
              className="flex-1 text-sm border border-gray-300 text-gray-700 py-2 rounded-lg font-meduim hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="flex-1 text-sm bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white py-2 rounded-lg font-meduim  transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Payment */}
      {step === 4 && (
        <div className="space-y-6">
          <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee:</span>
              <span className="font-semibold">
                ₦{Math.max(distance * 200, 1000).toFixed(0)}
              </span>
            </div>
            {insurance && (
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance:</span>
                <span className="font-semibold">
                  ₦{((packageDetails.value || 0) * 0.02).toFixed(0)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-800 font-semibold">Total:</span>
              <span className="text-lg font-bold text-orange-600">
                ₦
                {Math.max(
                  distance * 200 +
                    (insurance ? (packageDetails.value || 0) * 0.02 : 0),
                  1000
                ).toFixed(0)}
              </span>
            </div>
          </div>

          {/* Add validation for insurance value */}
          {insurance &&
            (!packageDetails.value || packageDetails.value <= 0) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">
                  Please enter a valid item value for insurance coverage.
                </p>
              </div>
            )}

          <div className="flex gap-3">
            <button
              onClick={prevStep}
              className="flex-1 border text-sm border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={
                isCalculating ||
                (insurance &&
                  (!packageDetails.value || packageDetails.value <= 0))
              }
              className="flex-1 text-sm bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white py-2 rounded-lg font-meduim hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isCalculating ? "Calculating..." : "Confirm Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
