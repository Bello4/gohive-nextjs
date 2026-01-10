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
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "ng" }, // Change to your country
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          onPlaceSelect(place);
          setQuery(place.formatted_address);
        }
      });
    }
  }, [onPlaceSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
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
    </div>
  );
}
