import axios from "@/lib/axios";
import {
  SizeFilters,
  FilteredSizesResponse,
  FilteredSizesApiResponse,
} from "@/types/product";

// Function: getFilteredSizes
// Description: Retrieves all sizes that exist in a product based on the filters (category, subCategory, offer).
// Permission Level: Public
// Params: filters - an object containing category, subCategory, and offer as URLs.
// Returns: Array of sizes in the form {id: string, size: string}[].
export async function getFilteredSizes(
  filters: SizeFilters = {},
  take: number = 10
): Promise<FilteredSizesResponse> {
  const params = new URLSearchParams();

  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  // Add take parameter
  params.append("take", take.toString());

  const response = await axios.get<FilteredSizesApiResponse>(
    `/api/v1/products/filtered-sizes?${params}`
  );

  return response.data.data;
}
