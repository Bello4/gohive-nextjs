"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

// Data table
import DataTable from "@/components/data-table";

// Plus icon
import { Plus } from "lucide-react";

// Offer tag details
import OfferTagDetails from "@/components/dashboard/forms/offer-tag-details";

// Columns
import { columns } from "./columns";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";

import Loading from "@/components/shared/loading";

export default function Page() {
  // Fetching offer tags data from the database
  // const offerTags = getAllOfferTags();
  const { data, error, isLoading } = useSWR("/api/v1/offerTags", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading />
      </div>
    );
  }

  if (error) return <p className="text-red-500">Failed to load datas</p>;
  // Checking if no offer tags are found
  // if (!offerTags) return null; // If no offer tags found, return null
  return (
    <>
      <SiteHeader header="Offer-Tags" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
            <DataTable
              actionButtonText={
                <>
                  <Plus size={15} />
                  Create offer tag
                </>
              }
              modalChildren={<OfferTagDetails />}
              filterValue="name"
              data={data.offerTags}
              searchPlaceholder="Search offer tag name..."
              columns={columns}
            />
          </div>
        </div>
      </div>
    </>
  );
}
