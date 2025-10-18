import axios from "@/lib/axios";

export async function updateUser(data: {
  id: number;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
}) {
  const response = await axios.put(`/api/v1/users/${data.id}`, data);
  return response.data.user; // returns the updated user from Laravel
}
