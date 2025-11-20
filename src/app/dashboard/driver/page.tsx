"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

import { DriverCards } from "@/components/driver-cards";
import { SiteHeader } from "@/components/site-header";
import DataTable from "@/components/data-table";
import { columns } from "./columns";
import RiderDispatchDetails from "@/components/dashboard/forms/rider-package-details";
import Loading from "@/components/shared/loading";

export default function Page() {
  const {
    data: dispatchs,
    error: dispatchsError,
    isLoading: dispatchsLoading,
  } = useSWR("/api/v1/rides", fetcher);

  if (dispatchsLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading />
      </div>
    );
  }
  console.log(dispatchs);

  if (dispatchsError) {
    return <p className="text-red-500">Failed to load data</p>;
  }
  return (
    <>
      <SiteHeader header="Dashboard Home" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DriverCards summary={dispatchs.data.summary} />
            <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
              <DataTable
                modalChildren={<RiderDispatchDetails />}
                filterValue={"status"}
                data={dispatchs.data.rides}
                searchPlaceholder="Search Dispatch..."
                columns={columns}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
