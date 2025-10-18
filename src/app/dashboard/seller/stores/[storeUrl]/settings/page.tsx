// DB
import StoreDetails from "@/components/dashboard/forms/store-details";
import { redirect } from "next/navigation";
import { getStoreByUrl } from "@/queries/store";
import { SiteHeader } from "@/components/site-header";

export default async function SellerStoreSettingsPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  const storeDetails = await getStoreByUrl(params.storeUrl);
  if (!storeDetails) redirect("/dashboard/seller/stores");
  return (
    <>
      <SiteHeader header="Store Settings " />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
            <StoreDetails data={storeDetails} />
          </div>
        </div>
      </div>
    </>
  );
}
