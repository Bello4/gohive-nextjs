"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import Loading from "@/components/shared/loading";
import { use } from "react"; // Import the use hook

import StoreDefaultShippingDetails from "@/components/dashboard/forms/store-default-shipping-details";
import DataTable from "@/components/data-table";
import {
  getStoreDefaultShippingDetails,
  getStoreShippingRates,
} from "@/queries/store";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { SiteHeader } from "@/components/site-header";

export default function SellerStoreShippingPage({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  // const shippingDetails = await getStoreDefaultShippingDetails(params.storeUrl);
  // const shippingRates = await getStoreShippingRates(params.storeUrl);
  // if (!shippingDetails || !shippingRates) return redirect("/");

  // Unwrap the params promise
  const resolvedParams = use(params);
  const storeUrl = resolvedParams.storeUrl;
  // Shipping details
  const {
    data: shippingDetails,
    error: shippingDetailsError,
    isLoading: isShippingDetailsLoading,
  } = useSWR(`/api/v1/stores/${storeUrl}/shipping-details`, fetcher);

  // Shipping rates
  const {
    data: shippingRates,
    error: shippingRatesError,
    isLoading: isShippingRatesLoading,
  } = useSWR(`/api/v1/stores/${storeUrl}/shipping-rates`, fetcher);

  console.log(storeUrl, shippingDetails, shippingRates);
  // Check if either is loading
  if (isShippingDetailsLoading || isShippingRatesLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading />
      </div>
    );
  }

  // Check for errors
  if (shippingDetailsError || shippingRatesError) {
    return <p className="text-red-500">Failed to load shipping data 111</p>;
  }
  return (
    <>
      <SiteHeader header="Store Order" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
            <StoreDefaultShippingDetails
              data={shippingDetails}
              storeUrl={storeUrl}
            />
            <DataTable
              filterValue="countryName"
              data={shippingRates}
              columns={columns}
              searchPlaceholder="Search by country name..."
            />
          </div>
        </div>
      </div>
    </>
  );
}
