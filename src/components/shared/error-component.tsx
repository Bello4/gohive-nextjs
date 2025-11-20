import React from "react";

export default function ErrorComponent() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-orange-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Order Not Found
        </h2>
        <p className="text-gray-600 mb-4">You don have any Data Available</p>
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
