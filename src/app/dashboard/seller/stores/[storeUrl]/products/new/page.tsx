import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCountries } from "@/queries/country";
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";
import { SiteHeader } from "@/components/site-header";
export default async function SellerNewProductPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  const [categories, offerTags, countries] = await Promise.all([
    getAllCategories(),
    getAllOfferTags(),
    getAllCountries(),
  ]);
  return (
    <>
      <SiteHeader header="Create New Product" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col px-3 gap-4 py-4 md:gap-6 md:py-6">
            <ProductDetails
              categories={categories}
              storeUrl={params.storeUrl}
              offerTags={offerTags}
              countries={countries}
            />
          </div>
        </div>
      </div>
    </>
  );
}
