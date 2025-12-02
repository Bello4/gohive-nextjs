import axios from "@/lib/axios";

//  Update order
export async function updateOrderGroupStatus(data: {
  id: number;
  status?: string;
  groupId: number;
}) {
  const response = await axios.put(`/api/v1/order/${data.id}`, data);
  return response.data.order; // returns the updated user from Laravel
}

export const updateOrderItemStatus = async () => {
  return;
};

export const getOrder = () => {
  return;
};
