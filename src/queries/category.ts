import axios from "@/lib/axios";

// Get all Categories
// export async function getAllCategories(storeUrl?: string) {
//   const response = await axios.get("/api/v1/getAllCategories");
//   return response.data.categories; // 👈 plural
// }

export async function getAllCategories(storeUrl?: string) {
  const params = storeUrl ? { url: storeUrl } : {};
  const response = await axios.get("/api/v1/getAllCategories", { params });
  // Depending on your Laravel response structure:
  return response.data.data; // Adjust based on actual response
}

// Get a Category
export async function getCategory(id: string | number) {
  const response = await axios.get(`/api/v1/categories/${id}`);
  return response.data.category;
}

// Create category
export async function createCategory(data: {
  name: string;
  image?: string;
  url: string;
  featured?: boolean;
}) {
  const response = await axios.post("/api/v1/categories", data);
  return response.data.category;
}

export async function upsertCategory(category: {
  id?: string;
  name: string;
  image?: string;
  url: string;
  featured?: boolean;
}) {
  const response = await axios.post("/api/v1/categories/upsert", category);
  return response.data.category;
}

//  Update Category
export async function updateCategory(data: {
  id: number;
  name?: string;
  image?: string;
  url?: string;
  featured?: boolean;
}) {
  const response = await axios.put(`/api/v1/categories/${data.id}`, data);
  return response.data.categories; // returns the updated user from Laravel
}

// Delete Category
export async function deleteCategory(id: string | number) {
  const response = await axios.delete(`/api/v1/categories/${id}`);
  return response.data;
}
