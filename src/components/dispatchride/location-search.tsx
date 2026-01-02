"use client";

import { useState, useRef, useEffect } from "react";

interface LocationSearchProps {
  label: string;
  onPlaceSelect: (place: any) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function LocationSearch({
  label,
  onPlaceSelect,
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize Google Places Autocomplete
    if (window.google && inputRef.current) {
      const warriBounds = new google.maps.LatLngBounds(
        // new google.maps.LatLng(5.45, 5.6), // Southwest corner (southwest of Warri)
        // new google.maps.LatLng(5.65, 5.85) // Northeast corner (northeast of Warri)

        new google.maps.LatLng(5.5, 5.7), // Southwest
        new google.maps.LatLng(5.58, 5.82) // Northeast
      );

      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address", "geocode", "establishment"],
          componentRestrictions: { country: "ng" }, // Change to your country
          bounds: warriBounds,
          strictBounds: true, // This restricts to ONLY locations within bounds
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          onPlaceSelect(place);
          setQuery(place.formatted_address);
          setShowPredictions(false);
        }
      });
    }
  }, [onPlaceSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowPredictions(true);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={`Enter ${label.toLowerCase()}...`}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />

      {/* Optional: Add a hint about the restricted area */}
      <p className="text-xs text-gray-500 mt-1">
        Searching in and around Warri, Delta State
      </p>
    </div>
  );
}
