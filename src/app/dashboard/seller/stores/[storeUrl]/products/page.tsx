import axios from "@/lib/axios";
// Queries
// import { getAllStoreProducts } from "@/queries/product";
import DataTable from "@/components/data-table";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";
import { getAllStoreProducts } from "@/queries/product";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";

export default async function SellerProductsPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  // Fetching products data from the database for the active store
  // const products = await getAllStoreProducts(params.storeUrl);

  // const response = axios.get(`/api/v1/stores/${params.storeUrl}/products`);
  // const products = response;
  console.log(params.storeUrl);

  // Fetch all required data in parallel
  const [categories, offerTags, products] = await Promise.all([
    getAllCategories(),
    getAllOfferTags(),
    getAllStoreProducts(params.storeUrl),
  ]);

  // Extract product data
  // const products = productsResponse.data.products || [];

  // console.log("Fetched products:", products);

  return (
    <>
      <SiteHeader header="Store Products" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
            <DataTable
              actionButtonText={
                <>
                  <Plus size={15} />
                  Create product
                </>
              }
              modalChildren={
                <ProductDetails
                  categories={categories}
                  offerTags={offerTags}
                  storeUrl={params.storeUrl}
                />
              }
              newTabLink={`/dashboard/seller/stores/${params.storeUrl}/products/new`}
              filterValue={["name"]}
              data={products}
              columns={columns}
              searchPlaceholder="Search product name..."
            />
          </div>
        </div>
      </div>
    </>
  );
}
