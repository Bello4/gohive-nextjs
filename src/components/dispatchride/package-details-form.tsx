"use client";

import { PackageDetails } from "@/app/(store)/logistic/recieve/page";
import { useState } from "react";

interface PackageDetailsFormProps {
  details: PackageDetails;
  onChange: (details: PackageDetails) => void;
  insuranceApplied: boolean; // Add this prop
}

const packageCategories = [
  "Clothes",
  "Food",
  "Books",
  "Phone",
  "Jewelry",
  "Documents",
  "Medicine",
  "Other",
];

export default function PackageDetailsForm({
  details,
  onChange,
  insuranceApplied,
}: PackageDetailsFormProps) {
  const [showCustomDescription, setShowCustomDescription] = useState(false);

  const handleCategorySelect = (category: string) => {
    const newDetails = {
      ...details,
      category,
      description: category === "Other" ? "" : category,
    };
    onChange(newDetails);
    setShowCustomDescription(category === "Other");
  };

  const handleFieldChange = (field: string, value: any) => {
    onChange({
      ...details,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Package Details</h3>

      {/* Package Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What's in the package?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {packageCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategorySelect(category)}
              className={`p-2 border rounded-lg text-sm font-medium transition-colors ${
                details.category === category
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-gray-300 text-gray-700 hover:border-orange-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Description */}
      {showCustomDescription && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Package Description
          </label>
          <input
            type="text"
            value={details.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="Describe the package contents..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      )}

      {/* Package Value - Only show when insurance is applied */}
      {insuranceApplied && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Value for Insurance (₦)
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            value={details.value || ""}
            onChange={(e) =>
              handleFieldChange("value", parseFloat(e.target.value) || 0)
            }
            min="1"
            required
            placeholder="Enter item value for insurance"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            This value is required for insurance coverage (2% of item value)
          </p>
        </div>
      )}
    </div>
  );
}
