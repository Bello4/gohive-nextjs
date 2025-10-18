"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import Loading from "@/components/shared/loading";

// Queries
import DataTable from "@/components/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
// import { getStoreCoupons } from "@/queries/coupon";
// import CouponDetails from "@/components/dashboard/forms/coupon-details";
import { SiteHeader } from "@/components/site-header";
import { getStoreOrders } from "@/queries/store";
import { use } from "react"; // Import the use hook

export default function SellerOrdersPage({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  // Unwrap the params promise
  const resolvedParams = use(params);
  const storeUrl = resolvedParams.storeUrl;
  // Get all store coupons
  //const orders = await getStoreOrders(params.storeUrl);
  // console.log(storeUrl);
  const { data, error, isLoading } = useSWR(
    `/api/v1/stores/${storeUrl}/orders`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading />
      </div>
    );
  }

  if (error) return <p className="text-red-500">Failed to load datas</p>;
  // const [orders] = await Promise.all([getStoreOrders(params.storeUrl)]);
  // console.log(orders);
  return (
    <>
      <SiteHeader header="Store Order" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
            <DataTable
              filterValue="id"
              data={data.orders}
              columns={columns}
              searchPlaceholder="Search order by id ..."
            />
          </div>
        </div>
      </div>
    </>
  );
}
