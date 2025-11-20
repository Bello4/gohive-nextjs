import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "./shared/theme-toggle";
import UserMenu from "./home/layout/header/user-menu/user-menu";
import DownloadApp from "./home/layout/header/download-app";

export function UserDashboardHeader({ header }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) shadow z-50 bg-gradient-to-r from-slate-600 to-slate-600">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-white font-medium">{header}</h1>
        <div className="ml-auto flex items-center gap-2">
          {/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <ThemeToggle />
          </Button> */}
          <div className="lg:flex">
            <DownloadApp />
          </div>
          <UserMenu />
        </div>
        {/* <div className="hidden lg:flex w-full lg:w-fit lg:mt-2 justify-end mt-1.5 pl-6">
                  <div className="lg:flex">
                    <DownloadApp />
                  </div>
                  <UserMenu />
                </div> */}
      </div>
    </header>
  );
}
