"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  //   const router = useRouter();
  const { user } = useAuth({ middleware: "auth" });
  // Block non admins from accessing the admin dashboard
  if (!user || user.data.role !== "SELLER") redirect("/");
  return <>{children}</>;
}
