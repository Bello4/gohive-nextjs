"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import Loading from "@/components/shared/loading";
import { useRouter, redirect } from "next/navigation";
// import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { useEffect } from "react";

export default function SellerDashboardPage() {
  const router = useRouter();
  // const { user } = useAuth({ middleware: "auth" });

  const { data, error, isLoading } = useSWR("/api/v1/mystores", fetcher);

  // Loading state
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading />
      </div>
    );
  }

  if (!data.stores) return;

  if (data.stores.length === 0) {
    redirect("/dashboard/seller/stores/new");
  } else {
    redirect(`/dashboard/seller/stores/${data.stores[0].url}`);
  }
  // // Redirect once data is available
  // useEffect(() => {
  // }, [data, router]);

  // Show a temporary placeholder while redirecting
  return (
    <div className="flex items-center justify-center h-screen">
      Redirecting...
    </div>
  );
}
