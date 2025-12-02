import axios from "@/lib/axios";
import { OrderDetails } from "@/types/logistic";

export async function getOrderDetails(
  orderId: number
): Promise<{ data: OrderDetails }> {
  const response = await axios.get(`/api/v1/dispatch-rides/${orderId}`);
  return response.data;
}

export async function cancelOrder(
  orderId: number,
  reason: string
): Promise<{ success: boolean; message: string }> {
  const response = await axios.post(
    `/api/v1/dispatch-rides/${orderId}/cancel`,
    { reason }
  );
  return response.data;
}

export async function getOrders(params?: {
  status?: string;
  page?: number;
  per_page?: number;
}): Promise<{ data: OrderDetails[] }> {
  const response = await axios.get("/api/v1/dispatch-rides", { params });
  return response.data;
}
