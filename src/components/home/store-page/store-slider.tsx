// components/StoreHorizontalList.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// import { getAllFeaturedStores, Store } from "@/queries/store;
import { getAllFeaturedStores, Store } from "@/queries/store";

export default function StoreHorizontalList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const storesData = await getAllFeaturedStores();
      setStores(storesData);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const StoreCard = ({ store }: { store: Store }) => (
    <div className="flex-shrink-0 w-48  rounded-lg shadow-sm border bg-white border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <Link href={`/store/${store.url}`} className="block">
        {/* Store Logo */}
        <div className="w-16 h-16 mx-auto mb-3 relative">
          <Image
            src={store.logo || "/default-store-logo.png"}
            alt={store.name}
            fill
            className="rounded-full object-cover"
          />
        </div>

        {/* Store Name */}
        <h3 className="font-semibold text-sm text-center text-gray-900 mb-2 line-clamp-2">
          {store.name}
        </h3>

        {/* Delivery Time */}
        <div className="flex items-center justify-center text-xs text-gray-600 mb-1">
          <span>🚚</span>
          <span className="ml-1">
            {store.default_delivery_time_min}-{store.default_delivery_time_max}{" "}
            minutes
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-xs text-gray-700 ml-1">
              {store.average_rating
                ? Number(store.average_rating).toFixed(2)
                : "0.0"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-48 bg-gray-200 rounded-lg p-4 animate-pulse"
            >
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="p-4 bg-gray-50">
      {/* Header with View More Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Popular Stores</h2>
        <Link
          href="/stores"
          className="px-4 py-2  text-gray-600 underline text-sm font-bold rounded-lg transition-colors duration-200"
        >
          View More
        </Link>
      </div>

      {/* Horizontal Scrollable Container */}
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
}
