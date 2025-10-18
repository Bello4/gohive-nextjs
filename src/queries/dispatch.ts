import axios from "@/lib/axios";

// Get all Categories
export async function getAllDispatchs() {
  const response = await axios.get("/api/v1/dispatchs");
  return response.data.dispatchs; // 👈 plural
}

export async function updateDispatch(data: {
  id: number;
  status?: string;
  driverId?: number;
}) {
  const response = await axios.put(`/api/v1/dispatch/${data.id}`, data);
  return response.data.dispatch; // returns the updated user from Laravel
}
