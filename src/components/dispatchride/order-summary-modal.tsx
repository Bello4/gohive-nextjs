"use client";

import { OrderData } from "@/app/(store)/logistic/recieve/page";

interface OrderSummaryModalProps {
  orderData: OrderData;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function OrderSummaryModal({
  orderData,
  onClose,
  onConfirm,
  isSubmitting,
  error,
}: OrderSummaryModalProps) {
  const deliveryFee = Math.max(orderData.distance * 400, 1000);
  const insuranceFee = orderData.insurance
    ? (orderData.package.value || 0) * 0.02
    : 0;
  const serviceCharge = deliveryFee * 0.1;
  const total = deliveryFee + insuranceFee + serviceCharge;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto mb-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-md font-bold">Order Summary</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Order Failed
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isSubmitting && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
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
                <span className="text-blue-800 font-medium">
                  Processing your order...
                </span>
              </div>
            </div>
          )}

          {/* Route Information */}
          <div className="space-y-4 mb-2">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-500">Pickup</div>
                <div className="text-sm">{orderData.pickup.address}</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-500">Dropoff</div>
                <div className="text-sm">{orderData.dropoff.address}</div>
              </div>
            </div>
          </div>

          {/* Distance & Time */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-1 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">
                {orderData.distance.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Distance (km)</div>
            </div>
            <div className="text-center p-1 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">
                {Math.ceil(orderData.duration)}
              </div>
              <div className="text-sm text-gray-600">Est. Time (min)</div>
            </div>
          </div>

          {/* Package Details */}
          <div className="space-y-2 mb-2">
            <h3 className="text-md font-bold">Package Details</h3>
            <div className="flex justify-between">
              <span>Category:</span>
              <span className="font-medium text-sm">
                {orderData.package.category}
              </span>
            </div>
            {orderData.package.description && (
              <div className="flex justify-between">
                <span>Description:</span>
                <span className="font-medium text-sm">
                  {orderData.package.description}
                </span>
              </div>
            )}
            {/* <div className="flex justify-between">
              <span>Weight:</span>
              <span className="font-medium">{orderData.package.weight} kg</span>
            </div> */}
            {orderData.package.value && orderData.package.value > 0 && (
              <div className="flex justify-between">
                <span>Value:</span>
                <span className="font-medium text-sm">
                  ₦{orderData.package.value}
                </span>
              </div>
            )}
          </div>

          {/* Insurance Details */}
          {orderData.insurance && (
            <div className="bg-blue-50 p-2 rounded-lg mb-2">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="font-semibold text-blue-800">
                  Insurance Applied
                </span>
              </div>
              <p className="text-sm text-blue-700">
                Your package is insured for ₦{orderData.package.value}. Coverage
                includes loss or damage during transit.
              </p>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="space-y-2 mb-4">
            <h3 className="text-md font-bold">Cost Breakdown</h3>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>₦{deliveryFee.toFixed(0)}</span>
            </div>
            {orderData.insurance && (
              <div className="flex justify-between">
                <span>Insurance Fee:</span>
                <span>₦{insuranceFee.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-1 font-bold text-sm">
              <span>Total:</span>
              <span className="text-orange-600">₦{total.toFixed(0)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Payment Method</h3>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="capitalize">
                {orderData.paymentMethod.replace("_", " ")}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  orderData.paymentMethod === "delivery"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {orderData.paymentMethod === "delivery"
                  ? "Pay On Delivery"
                  : "Pay from Wallet"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 text-sm border border-gray-300 text-gray-700 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 text-sm bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white py-2 rounded-lg font-medium "
            >
              Confirm & Pay
            </button>
          </div> */}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border text-sm border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 text-sm bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white py-2 rounded-lg font-medium"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin text-center ml-5 h-4 w-4 text-white"
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
                  Processing...
                </>
              ) : (
                `Confirm & ${
                  orderData.paymentMethod === "delivery" ? "Place Order" : "Pay"
                }`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
