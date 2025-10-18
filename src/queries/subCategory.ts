import axios from "@/lib/axios";

// Get all Categories
export async function getAllSubCategories() {
  const response = await axios.get("/api/v1/subCategories");
  return response.data.categories; // 👈 plural
}

// Get a Category
export async function getSubCategory(id: string | number) {
  const response = await axios.get(`/api/v1/subCategories/${id}`);
  return response.data.category;
}

// Create category
export async function createSubCategory(data: {
  name: string;
  image?: string;
  url: string;
  featured?: boolean;
}) {
  const response = await axios.post("/api/v1/subCategories", data);
  return response.data.category;
}

export async function upsertSubCategory(category: {
  id?: string;
  name: string;
  image?: string;
  url: string;
  featured?: boolean;
}) {
  const response = await axios.post("/api/v1/subCategories/upsert", category);
  return response.data.category;
}

//  Update Category
export async function updateSubCategory(data: {
  id: number;
  name?: string;
  image?: string;
  url?: string;
  featured?: boolean;
}) {
  const response = await axios.put(`/api/v1/subCategories/${data.id}`, data);
  return response.data.categories; // returns the updated user from Laravel
}

// Delete Category
export async function deleteSubCategory(id: string | number) {
  const response = await axios.delete(`/api/v1/subCategories/${id}`);
  return response.data;
}
