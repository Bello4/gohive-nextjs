"use client";

import { OrderDetails } from "@/types/logistic";
import { User, Phone, Mail, Car } from "lucide-react";

interface ContactDetailsCardProps {
  order: OrderDetails;
}

export default function ContactDetailsCard({ order }: OrderDetailsCardProps) {
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleSMS = (phone: string) => {
    window.open(`sms:${phone}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-md font-semibold text-gray-900 mb-4">
        Contact Details
      </h2>

      <div className="space-y-6">
        {/* Sender Details */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Sender Information
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-900 font-medium">
              {order.parties.sender.name}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                {order.parties.sender.phone}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCall(order.parties.sender.phone)}
                  className="text-orange-500 hover:text-orange-600 p-1"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSMS(order.parties.sender.phone)}
                  className="text-gray-500 hover:text-gray-600 p-1"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600">{order.parties.sender.email}</p>
          </div>
        </div>

        {/* Receiver Details */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Receiver Information
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-900 font-medium">
              {order.parties.receiver.name}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                {order.parties.receiver.phone}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCall(order.parties.receiver.phone)}
                  className="text-orange-500 hover:text-orange-600 p-1"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSMS(order.parties.receiver.phone)}
                  className="text-gray-500 hover:text-gray-600 p-1"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
            {order.parties.receiver.email && (
              <p className="text-gray-600">{order.parties.receiver.email}</p>
            )}
          </div>
        </div>

        {/* Driver Details (if assigned) */}
        {order.driver && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Car className="w-4 h-4 mr-2" />
              Driver Information
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-900 font-medium">{order.driver.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{order.driver.phone}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCall(order.driver.phone)}
                    className="text-orange-500 hover:text-orange-600 p-1"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSMS(order.driver.phone)}
                    className="text-gray-500 hover:text-gray-600 p-1"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {order.driver.vehicle_type && (
                <p className="text-gray-600">
                  Vehicle: {order.driver.vehicle_type}
                  {order.driver.vehicle_number &&
                    ` (${order.driver.vehicle_number})`}
                </p>
              )}
              {order.driver.rating && (
                <p className="text-gray-600">
                  Rating: {order.driver.rating} ⭐
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
