"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
// import { getAllCategories } from "@/queries/category";
import Loading from "@/components/shared/loading";

export default function AdminNewSubCategoryPage() {
  // const categories = getAllCategories();
  const { data, error, isLoading } = useSWR("/api/v1/categories", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading />
      </div>
    );
  }

  if (error) return <p className="text-red-500">Failed to load datas</p>;
  return <SubCategoryDetails categories={data.categories} />;
}
