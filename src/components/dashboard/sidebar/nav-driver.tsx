"use client";

import * as React from "react";

import {
  BoxesIcon,
  BoxListIcon,
  CategoriesIcon,
  CreateStoreIcon,
  DashboardIcon,
  StoreIcon,
  SettingsIcon,
  PeopleIcon,
  DriverIcon,
  ThreeBoxesIcon,
  ProductsIcon,
  InventoryIcon,
  CouponIcon,
  ShippingIcon,
  OfferIcon,
} from "@/components/dashboard/icons";
import Logo from "@/components/shared/logo";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
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

export function RiderSidebar({
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
      {
        title: "Dashboard",
        url: "/dashboard/admin",
        icon: DashboardIcon,
      },
      {
        title: "Products",
        icon: ProductsIcon,
        url: "products",
      },
      {
        title: "Orders",
        icon: BoxListIcon,
        url: "orders",
      },
      {
        title: "Inventory",
        icon: InventoryIcon,
        url: "inventory",
      },
      {
        title: "Coupons",
        icon: CouponIcon,
        url: "coupons",
      },
      {
        title: "Supply",
        icon: ShippingIcon,
        url: "shipping",
      },
      {
        title: "Settings",
        icon: SettingsIcon,
        url: "settings",
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
              <a href="#">
                {/* <IconInnerShadowTop className="!size-5" /> */}
                <Logo width="50%" height="20px" />
              </a>
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
