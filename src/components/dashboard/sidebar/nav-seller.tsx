"use client";

import * as React from "react";

import {
  BoxListIcon,
  DashboardIcon,
  SettingsIcon,
  ProductsIcon,
  InventoryIcon,
  CouponIcon,
  ShippingIcon,
} from "@/components/dashboard/icons";
import Logo from "@/components/shared/logo";
import { NavMain } from "@/components/sub-nav-main";
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
import StoreSwitcher from "./store-switcher";

import { useAuth } from "@/hooks/auth";
import { Store } from "@/types/store";

interface SellerSidebarProps extends React.ComponentProps<typeof Sidebar> {
  stores?: Store[];
}

export function SellerSidebar({ stores, ...props }: SellerSidebarProps) {
  const { user } = useAuth();

  const data = {
    user: {
      name: user?.data?.name ?? "Unknown User",
      email: user?.data?.email ?? "unknown@example.com",
      avatar: user?.data?.picture || "/assets/auth/default-user.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "dashboard",
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
        title: "Delivery",
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
                <Logo width="50%" height="20px" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <StoreSwitcher stores={stores} />
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
