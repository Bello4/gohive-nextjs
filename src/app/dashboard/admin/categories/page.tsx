"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";

import DataTable from "@/components/data-table";
import { Plus } from "lucide-react";
import CategoryDetails from "@/components/dashboard/forms/category-details";
import { columns } from "./columns";
import Loading from "@/components/shared/loading";

export default function Page() {
  const { data, error, isLoading } = useSWR("/api/v1/categories", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading />
      </div>
    );
  }

  if (error) return <p className="text-red-500">Failed to load datas</p>;
  return (
    <>
      <SiteHeader header="Categories" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
            <DataTable
              actionButtonText={
                <>
                  <Plus size={15} />
                  Create category
                </>
              }
              modalChildren={<CategoryDetails />}
              newTabLink="/dashboard/admin/categories/new"
              filterValue="name"
              data={data.categories}
              searchPlaceholder="Search category name..."
              columns={columns}
            />
          </div>
        </div>
      </div>
    </>
  );
}
