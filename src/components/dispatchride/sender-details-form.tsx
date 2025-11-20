"use client";

import { SenderDetails } from "@/app/(store)/logistic/recieve/page";

interface SenderDetailsFormProps {
  details: SenderDetails;
  onChange: (details: SenderDetails) => void;
  user: any;
}

export default function SenderDetailsForm({
  details,
  onChange,
  user,
}: SenderDetailsFormProps) {
  const handleUseAuthInfoToggle = (useAuthInfo: boolean) => {
    if (useAuthInfo && user) {
      onChange({
        ...details,
        useAuthInfo: true,
        name: user.data?.name || "",
        email: user.data?.email || "",
        phone: user.data?.phone || "",
      });
    } else {
      onChange({
        ...details,
        useAuthInfo: false,
        name: "",
        email: "",
        phone: "",
      });
    }
  };

  const handleFieldChange = (field: keyof SenderDetails, value: string) => {
    onChange({
      ...details,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sender Details</h3>
        {user && (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={details.useAuthInfo}
              onChange={(e) => handleUseAuthInfoToggle(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
            <span className="text-sm text-gray-600">Use my account info</span>
          </label>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={details.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          disabled={details.useAuthInfo}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={details.phone}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
          disabled={details.useAuthInfo}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          value={details.email}
          onChange={(e) => handleFieldChange("email", e.target.value)}
          disabled={details.useAuthInfo}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
          required
        />
      </div>
    </div>
  );
}
