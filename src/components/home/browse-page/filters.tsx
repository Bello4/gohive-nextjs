import { FiltersQueryType } from "@/types/product";
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";
import CategoryFilter from "./filters/category/category-filter";
import OfferFilter from "./filters/offer/offer-filter";
import SizeFilter from "./filters/size/size-filter";
import FiltersHeader from "./filters/header";

export default async function ProductFilters({
  queries,
  storeUrl,
}: {
  queries: FiltersQueryType;
  storeUrl?: string;
}) {
  const { category, subCategory, offer } = queries;
  const categories = await getAllCategories(storeUrl);
  const offers = await getAllOfferTags(storeUrl);

  return (
    <div className="w-full lg:w-44 xl:w-48 h-auto lg:h-[840px] transition-all overflow-hidden lg:overflow-auto lg:pr-6 pb-2.5 flex-none lg:sticky lg:top-0">
      {/* Mobile: Header always visible */}
      <div className="lg:hidden mb-4">
        <FiltersHeader queries={queries} />
      </div>

      {/* Desktop: Header inside scroll area */}
      <div className="hidden lg:block">
        <FiltersHeader queries={queries} />
      </div>

      {/* Filters Container */}
      <div className="border-t lg:border-t-0 pt-4 lg:pt-0 w-full lg:w-44 xl:w-52">
        <div className="space-y-6 lg:space-y-8">
          <CategoryFilter categories={categories} />
          <OfferFilter offers={offers} />
          <SizeFilter queries={queries} storeUrl={storeUrl} />
        </div>
      </div>
    </div>
  );
}
