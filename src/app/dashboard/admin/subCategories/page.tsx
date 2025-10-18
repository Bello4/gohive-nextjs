"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
// import { DataTable } from "@/components/data-table";
import DataTable from "@/components/data-table";
import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import Loading from "@/components/shared/loading";

export default function Page() {
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useSWR("/api/v1/categories", fetcher);

  const {
    data: subCategories,
    error: subCategoriesError,
    isLoading: subCategoriesLoading,
  } = useSWR("/api/v1/subCategories", fetcher);

  if (categoriesLoading || subCategoriesLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading />
      </div>
    );
  }

  // console.log(subCategories.subCategories);
  if (categoriesError || subCategoriesError) {
    return <p className="text-red-500">Failed to load data</p>;
  }
  return (
    <>
      <SiteHeader header="Sub-Categories" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
            <DataTable
              actionButtonText={
                <>
                  <Plus size={15} />
                  Create SubCategory
                </>
              }
              modalChildren={<SubCategoryDetails categories={categories} />}
              newTabLink="/dashboard/admin/subCategories/new"
              filterValue="name"
              data={subCategories.subCategories}
              searchPlaceholder="Search subCategory name..."
              columns={columns}
            />
          </div>
        </div>
      </div>
    </>
  );
}
