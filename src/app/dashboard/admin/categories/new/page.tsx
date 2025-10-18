import CategoryDetails from "@/components/dashboard/forms/category-details";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";

export default function AdminNewCategoryPage() {
  return (
    <SidebarInset>
      <SiteHeader header="Categories" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
            <CategoryDetails />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
