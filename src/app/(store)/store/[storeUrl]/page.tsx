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

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 border-t pt-6">
        {/* Mobile: Filters as dropdown/offcanvas */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                queries={searchParams}
                storeUrl={params.storeUrl}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Toggle & Sort - Visible on mobile only */}
            <div className="lg:hidden mb-4">
              <div className="flex items-center justify-between gap-4">
                {/* Mobile Filter Button */}
                <details className="dropdown flex-1">
                  <summary className="btn btn-outline w-full justify-between">
                    <span>Filters</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                      />
                    </svg>
                  </summary>
                  <div className="dropdown-content mt-2 p-4 shadow-lg bg-base-100 rounded-box w-64 max-h-96 overflow-y-auto">
                    <ProductFilters
                      queries={searchParams}
                      storeUrl={params.storeUrl}
                    />
                  </div>
                </details>

                {/* Sort Dropdown */}
                <div className="flex-shrink-0">
                  <ProductSort />
                </div>
              </div>
            </div>

            {/* Desktop Sort - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:block mb-6">
              <ProductSort />
            </div>

            {/* Products Grid */}
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
