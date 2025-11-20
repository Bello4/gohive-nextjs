import axios from "@/lib/axios";

export interface StoreCard {
  id: number;
  name: string;
  description: string;
  logo?: string;
  cover?: string;
  average_rating: number;
  num_reviews: number;
  featured: boolean;
  default_delivery_time_min: number;
  default_delivery_time_max: number;
  url: string;
}

export interface StoresResponse {
  status: "success" | "error";
  data?: {
    stores: StoreCard[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
      from: number;
      to: number;
    };
  };
  message?: string;
}

export interface StoresParams {
  search?: string;
  min_rating?: number;
  featured?: boolean;
  sort_by?:
    | "name"
    | "average_rating"
    | "num_reviews"
    | "created_at"
    | "featured";
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

/**
 * Get paginated list of stores with filters
 */
export async function getStores(
  params?: StoresParams
): Promise<StoresResponse["data"]> {
  const response = await axios.get<StoresResponse>("/api/v1/userstores", {
    params,
  });

  if (response.data.status === "error") {
    throw new Error(response.data.message || "Failed to fetch stores");
  }

  return response.data.data!;
}

/**
 * Get featured stores for homepage
 */
export async function getFeaturedStores(): Promise<StoreCard[]> {
  const response = await axios.get<{ status: string; data: StoreCard[] }>(
    "/api/v1/stores/featured"
  );

  if (response.data.status === "error") {
    throw new Error("Failed to fetch featured stores");
  }

  return response.data.data;
}
