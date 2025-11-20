"use client";

import { useAuth } from "@/hooks/auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Loading from "@/components/shared/loading";
import { SidebarInset } from "@/components/ui/sidebar";
import Sidebar from "@/components/dashboard/sidebar/sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth({ middleware: "auth" });

  // While user is still loading
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading />
      </div>
    );
  }

  // If user is not admin, redirect
  if (user.data.role !== "DRIVER") {
    redirect("/");
  }

  // At this point, we know the user is an admin
  const isDriver = true;

  return (
    <>
      <Sidebar isDriver={isDriver} />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
