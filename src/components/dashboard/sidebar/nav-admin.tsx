"use client";

import * as React from "react";

import {
  BoxListIcon,
  CategoriesIcon,
  DashboardIcon,
  StoreIcon,
  DriverIcon,
  CouponIcon,
  OfferIcon,
} from "@/components/dashboard/icons";
import Logo from "@/components/shared/logo";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Users2Icon } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import Link from "next/link";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth(); // ✅ Correct placement

  const data = {
    user: {
      name: user?.data?.name ?? "Unknown User",
      email: user?.data?.email ?? "unknown@example.com",
      avatar: user?.data?.picture || "/assets/auth/default-user.jpg",
    },
    navMain: [
      { title: "Dashboard", url: "/dashboard/admin", icon: DashboardIcon },
      { title: "Users", url: "/dashboard/admin/users", icon: Users2Icon },
      { title: "Dispatch", url: "/dashboard/admin/dispatch", icon: DriverIcon },
      { title: "Stores", url: "/dashboard/admin/stores", icon: StoreIcon },
      {
        title: "Categories",
        url: "/dashboard/admin/categories",
        icon: CategoriesIcon,
      },
      {
        title: "Sub-Categories",
        url: "/dashboard/admin/subCategories",
        icon: CategoriesIcon,
      },
      {
        title: "Offer Tags",
        url: "/dashboard/admin/offer-tags",
        icon: OfferIcon,
      },
    ],
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={"/"}>
                <Logo width="50%" height="20px" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavMain className="h-18 w-18" items={data.navMain} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
