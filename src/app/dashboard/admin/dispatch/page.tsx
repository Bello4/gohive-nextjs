"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

// Data table
import DataTable from "@/components/data-table";
import DispatchDetails from "@/components/dashboard/forms/dispatch-details";
import { columns } from "./columns";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import Loading from "@/components/shared/loading";

export default function Page() {
  const {
    data: drivers,
    error: driversError,
    isLoading: driversLoading,
  } = useSWR("/api/v1/drivers", fetcher);

  const {
    data: dispatchs,
    error: dispatchsError,
    isLoading: dispatchsLoading,
  } = useSWR("/api/v1/dispatchs", fetcher);

  if (driversLoading || dispatchsLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading />
      </div>
    );
  }
  // console.log(drivers);

  if (driversError || dispatchsError) {
    return <p className="text-red-500">Failed to load data</p>;
  }
  return (
    <>
      <SiteHeader header="Parcels" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
            <DataTable
              modalChildren={
                <DispatchDetails
                  data={dispatchs.data}
                  drivers={drivers?.data}
                />
              }
              filterValue={"ordernumber"}
              data={dispatchs.data}
              searchPlaceholder="Search Dispatch..."
              columns={columns(drivers?.data || [])}
            />
          </div>
        </div>
      </div>
    </>
  );
}
