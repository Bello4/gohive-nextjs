import { ReactNode } from "react";
import Header from "@/components/home/layout/header/header";
import ProfileSidebar from "@/components/home/layout/profile-sidebar/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserDashboardHeader } from "@/components/user-header";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 14)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          {/* <Header /> */}
          <UserDashboardHeader header="User Profile" />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* <SectionCards /> */}

                <div className="w-full mt-4">{children}</div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="max-w-container mx-auto flex gap-4 p-4">
        <ProfileSidebar />
        <div className="w-full mt-12">{children}</div>
      </div>
    </div> */}
    </>
  );
}
