import axios from "@/lib/axios";
import { StoreOrderType } from "@/types/order";
import { ShippingRate } from "@/types/shippingrates";
import { StoreDetails } from "@/types/store";

// Or using the function directly
export async function getStoreByUrl(storeUrl: string): Promise<StoreDetails> {
  const response = await axios.get(`/api/v1/stores/${storeUrl}`);
  return response.data.data;
}

//  Update Category
export async function updateStoreStatus(data: { id: number; status?: string }) {
  const response = await axios.put(`/api/v1/store/${data.id}`, data);
  return response.data.store; // returns the updated user from Laravel
}

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

//  delete store by updating status
// export async function deleteStore(data: { id: number; status: number }) {
//   const response = await axios.put(`/api/v1/store/${data.id}`, data);
//   return response.data; // returns the updated user from Laravel
// }
