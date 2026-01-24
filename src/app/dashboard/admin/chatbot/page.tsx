"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import DataTable from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import Loading from "@/components/shared/loading";
import { columns } from "./columns";
import ChatbotDetails from "@/components/dashboard/forms/chatbot-details";
// import data from "./data.json";

export default function Page() {
  const { data, error, isLoading } = useSWR("/api/v1/chatbots", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loading />
      </div>
    );
  }

  if (error) return <p className="text-red-500">Failed to load Bots</p>;
  return (
    <>
      <SiteHeader header="Chat Bot" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
            <DataTable
              modalChildren={<ChatbotDetails />}
              newTabLink="/dashboard/admin/chatbot/new"
              filterValue={"name"}
              data={data.chatbots}
              searchPlaceholder="Search Data..."
              columns={columns}
            />
          </div>
        </div>
      </div>
    </>
  );
}
