"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconUsers,
} from "@tabler/icons-react";
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
import { useAuth } from "@/hooks/auth";
import Image from "next/image";
import Link from "next/link";

// Logo image
// import LogoImg from "../../../public/assets/icons/logo-small.png";
import LogoImg from "../../public/assets/icons/logo-small.png";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth(); // ✅ Correct placement

  const data = {
    user: {
      name: user?.data?.name ?? "Unknown User",
      email: user?.data?.email ?? "unknown@example.com",
      avatar: user?.data?.picture || "/assets/auth/default-user.jpg",
    },
    navMain: [
      {
        title: "Overview",
        url: "/profile",
        icon: IconDashboard,
      },
      {
        title: "Orders",
        url: "/profile/orders",
        icon: IconListDetails,
      },
      {
        title: "Payment",
        url: "/profile/payment",
        icon: IconChartBar,
      },
      {
        title: "Shipping address",
        url: "/profile/addresses",
        icon: IconFolder,
      },
      {
        title: "Reviews",
        url: "/profile/reviews",
        icon: IconUsers,
      },
      {
        title: "History",
        url: "/profile/history/1",
        icon: IconUsers,
      },
      {
        title: "Wishlist",
        url: "/profile/wishlist/1",
        icon: IconUsers,
      },
      {
        title: "Following",
        url: "/profile/following/1",
        icon: IconUsers,
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
                {/* <IconInnerShadowTop className="!size-5" /> */}
                <div className=" z-50" style={{ width: "50%", height: "20px" }}>
                  <Image
                    src={LogoImg}
                    alt="GoHive"
                    className="w-full h-full object-cover overflow-visible"
                  />
                </div>
                {/* <Logo width="50%" height="20px" /> */}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
