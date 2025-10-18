"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { SidebarInset } from "@/components/ui/sidebar";
import Loading from "@/components/shared/loading";
// React,Next.js
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import StoreSwitcher from "@/components/dashboard/sidebar/store-switcher";

// Custom UI Components
import Sidebar from "@/components/dashboard/sidebar/sidebar";

export default function SellerStoreDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Fetch the current user. If the user is not authenticated, redirect them to the home page.
  const { data, error, isLoading } = useSWR("/api/v1/mystores", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading />
      </div>
    );
  }

  if (error) return <p className="text-red-500">Failed to load users</p>;

  return (
    <>
      <Sidebar stores={data.stores} />
      <SidebarInset>
        {/* <SiteHeader header="Dashboard Home" /> */}
        {/* <StoreSwitcher stores={stores} /> */}
        {/* <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            </div>
          </div>
        </div> */}
        {children}
      </SidebarInset>
    </>
  );
}
