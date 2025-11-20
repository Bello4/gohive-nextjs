import axios from "@/lib/axios";
import { FeaturedCategory, FeaturedCategoriesResponse } from "@/types/category";
import { StorePageDetails, StorePageDetailsResponse } from "@/types/store";

export async function getHomeFeaturedCategories(): Promise<FeaturedCategory[]> {
  const response = await axios.get<FeaturedCategoriesResponse>(
    "/api/v1/categories/featured"
  );
  return response.data.data;
}

export async function getStorePageDetails(
  storeUrl: string
): Promise<StorePageDetails> {
  const response = await axios.get<StorePageDetailsResponse>(
    `/api/v1/stores/${storeUrl}`
  );

  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to fetch store details");
  }

  return response.data.data;
}
