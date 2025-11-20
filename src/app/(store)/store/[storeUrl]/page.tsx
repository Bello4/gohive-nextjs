import ProductFilters from "@/components/home/browse-page/filters";
import ProductSort from "@/components/home/browse-page/sort";
import CategoriesHeader from "@/components/home/layout/categories-header/categories-header";
import Header from "@/components/home/layout/header/header";
import StoreDEetails from "@/components/home/store-page/store-details";
import StoreProducts from "@/components/home/store-page/store-products";
import { FiltersQueryType } from "@/types/product";
import { getStorePageDetails } from "@/queries/home";

export default async function StorePage({
  params,
  searchParams,
}: {
  params: { storeUrl: string };
  searchParams: FiltersQueryType;
}) {
  const store = await getStorePageDetails(params.storeUrl);
  return (
    <>
      <Header />
      {/* <CategoriesHeader /> */}
      <StoreDEetails details={store} />
      <div className="max-w-[95%] mx-auto border-t">
        <div className="flex mt-5 gap-x-5">
          <ProductFilters queries={searchParams} storeUrl={params.storeUrl} />
          <div className="p-4 space-y-5">
            <ProductSort />
            <StoreProducts
              searchParams={searchParams}
              store={params.storeUrl}
            />
          </div>
        </div>
      </div>
    </>
  );
}
