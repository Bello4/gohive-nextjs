import axios from "@/lib/axios";
import { StoreOrderType } from "@/types/order";
import { StoreStatus } from "@/types/store";
import { ShippingRate } from "@/types/shippingrates";
import { StoreDetails } from "@/types/store";
import { FollowStoreResponse } from "@/types/store";

// Or using the function directly
export async function getStoreByUrl(storeUrl: string): Promise<StoreDetails> {
  const response = await axios.get(`/api/v1/stores/${storeUrl}`);
  return response.data.data;
}

//  Update Category
// export async function updateStoreStatus(id: number, status: StoreStatus) {
//   const response = await axios.put(`/api/stores/${id}`, { status: status });
//   return response.data;
// }

export async function updateStoreStatus(data: {
  id: number;
  status: StoreStatus;
}) {
  const response = await axios.put(`/api/v1/updateStoreStatus/${data.id}`, {
    status: data.status, // Send only the status field, not the entire data object
  });
  return response.data;
}
//  Update Category
// export async function updateStoreStatus(
//   {storeId
//   status}
// ) {
//   const response = await axios.put(
//     `/api/v1/updateStoreStatus/${storeId}`,
//     status
//   );
//   return response.data.store; // returns the updated user from Laravel
// }

export async function deleteStore(id: string | number) {
  const response = await axios.delete(`/api/v1/store/${id}`);
  return response.data;
}

export async function upsertStore(store: {
  id?: number;
  name: string;
  description: string;
  email: string;
  phone: string;
  logo: string;
  cover: string;
  url: string;
  featured?: boolean;
}) {
  const response = await axios.post("/api/v1/createstore/upsert", store);
  return response.data.store;
}
//

// : Promise<StoreOrderType[]>
export const getStoreOrders = async (
  storeUrl: string
): Promise<StoreOrderType[]> => {
  const res = await axios.get(`/api/v1/stores/${storeUrl}/orders`);

  if (!res.data.success) throw new Error(res.data.message);
  return res.data.data;
};

export const getStoreDefaultShippingDetails = async (storeUrl: string) => {
  const res = await axios.get(`/api/stores/${storeUrl}/shipping-details`);
  return res.data.data; // Accessing the 'data' object from the API response
};
export const getStoreShippingRates = async (storeUrl: string) => {
  const res = await axios.get(`/api/stores/${storeUrl}/shipping-details`);
  return res.data.data; // Accessing the 'data' object from the API response
};

export async function upsertShippingRate(
  storeUrl: string,
  shippingRate: {
    id?: number;
    countryId: string;
    shippingService: string;
    shippingFeePerItem: number;
    shippingFeeForAdditionalItem: number;
    shippingFeePerKg: number;
    shippingFeeFixed: number;
    deliveryTimeMin: number;
    deliveryTimeMax: number;
    returnPolicy: string;
    storeId?: string;
  }
) {
  const response = await axios.post(
    `/api/V1/stores/${storeUrl}/shipping-rates/upsert`,
    shippingRate
  );
  return response.data.data;
}

export async function updateStoreDefaultShippingDetails(
  storeUrl: string,
  shippingDetails: {
    defaultShippingService: string;
    defaultShippingFeePerItem: number;
    defaultShippingFeeForAdditionalItem: number;
    defaultShippingFeePerKg: number;
    defaultShippingFeeFixed: number;
    defaultDeliveryTimeMin: number;
    defaultDeliveryTimeMax: number;
    returnPolicy: string;
  }
) {
  const response = await axios.post(
    `/api/stores/${storeUrl}/shipping-details/update`,
    shippingDetails
  );
  return response.data.data;
}

export async function followStore(storeId: string): Promise<{
  isFollowing: boolean;
  followersCount: number;
}> {
  const response = await axios.post<FollowStoreResponse>(
    `/api/v1/stores/${storeId}/follow`
  );

  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to toggle follow status");
  }

  return response.data.data;
}

export interface StoreType {
  name: string;
  description: string;
  email: string;
  phone: string;
  url: string;
  logo?: string;
  cover?: string;
  return_policy?: string;
  default_shipping_service?: string;
  default_shipping_fee_per_item?: number;
  default_shipping_fee_for_additional_item?: number;
  default_shipping_fee_per_kg?: number;
  default_shipping_fee_fixed?: number;
  default_delivery_time_min?: number;
  default_delivery_time_max?: number;
}

export interface StoreResponse {
  id: number;
  name: string;
  description: string;
  email: string;
  phone: string;
  url: string;
  logo?: string;
  cover?: string;
  status: string;
  average_rating: number;
  num_reviews: number;
  featured: boolean;
  return_policy: string;
  default_shipping_service: string;
  default_shipping_fee_per_item: number;
  default_shipping_fee_for_additional_item: number;
  default_shipping_fee_per_kg: number;
  default_shipping_fee_fixed: number;
  default_delivery_time_min: number;
  default_delivery_time_max: number;
  userId: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Apply to become a seller by creating a store
 */
export async function applySeller(store: StoreType): Promise<StoreResponse> {
  const response = await axios.post<ApiResponse<StoreResponse>>(
    "/api/v1/stores/apply",
    store
  );

  if (response.data.status === "error") {
    throw new Error(response.data.message || "Failed to apply as seller");
  }

  return response.data.data!;
}

/**
 * Get current user's store
 */
export async function getMyStore(): Promise<StoreResponse> {
  const response = await axios.get<ApiResponse<StoreResponse>>(
    "/api/v1/stores/my-store"
  );

  if (response.data.status === "error") {
    throw new Error(response.data.message || "Failed to get store");
  }

  return response.data.data!;
}

/**
 * Update store details
 */
export async function updateStore(
  storeData: Partial<StoreType>
): Promise<StoreResponse> {
  const response = await axios.put<ApiResponse<StoreResponse>>(
    "/api/v1/stores/my-store",
    storeData
  );

  if (response.data.status === "error") {
    throw new Error(response.data.message || "Failed to update store");
  }

  return response.data.data!;
}

/**
 * Check if store details are unique
 */
export async function checkStoreUnique(params: {
  name?: string;
  email?: string;
  phone?: string;
  url?: string;
}): Promise<{ isUnique: boolean; message?: string }> {
  // This would be a separate endpoint you could create
  // For now, we'll handle duplicates in the applySeller function
  return { isUnique: true };
}

//  delete store by updating status
// export async function deleteStore(data: { id: number; status: number }) {
//   const response = await axios.put(`/api/v1/store/${data.id}`, data);
//   return response.data; // returns the updated user from Laravel
// }
