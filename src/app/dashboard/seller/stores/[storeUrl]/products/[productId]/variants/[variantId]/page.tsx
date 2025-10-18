// Product details form
import ProductDetails from "@/components/dashboard/forms/product-details";

// Queries
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";
import { getProductVariant } from "@/queries/product";
import { SiteHeader } from "@/components/site-header";
import { getAllCountries } from "@/queries/country";

export default async function ProductVariantPage({
  params,
}: {
  params: { storeUrl: string; productId: string; variantId: string };
}) {
  const countries = await getAllCountries(); // ✅ works fine
  const categories = await getAllCategories();
  const offerTags = await getAllOfferTags();
  const { productId, variantId, storeUrl } = params;
  const productDetails = await getProductVariant(productId, variantId);
  if (!productDetails) return;
  return (
    <>
      <SiteHeader header="Create New Product" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col px-3 gap-4 py-4 md:gap-6 md:py-6">
            <ProductDetails
              categories={categories}
              offerTags={offerTags}
              countries={countries}
              storeUrl={storeUrl}
              data={productDetails}
            />
          </div>
        </div>
      </div>
    </>
  );
}
