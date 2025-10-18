"use client";
import { ReactNode } from "react";

import { AdminSidebar } from "@/components/dashboard/sidebar/nav-admin";
import { RiderSidebar } from "@/components/dashboard/sidebar/nav-driver";
import { SellerSidebar } from "@/components/dashboard/sidebar/nav-seller";
import { SidebarProvider } from "@/components/ui/sidebar";
import Loading from "@/components/shared/loading";
import { useAuth } from "@/hooks/auth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth({ middleware: "auth" });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading />
      </div>
    ); // optional loader
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* {user.data.role === "ADMIN" ? (
        <AdminSidebar variant="inset" />
      ) : user.data.role === "DRIVER" ? (
        <RiderSidebar variant="inset" />
      ) : (
        <SellerSidebar variant="inset" />
      )} */}

      {children}
    </SidebarProvider>
  );
}
