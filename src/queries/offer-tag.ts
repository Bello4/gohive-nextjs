import axios from "@/lib/axios";

// Get all Categories
export async function getAllOfferTags() {
  const response = await axios.get("/api/v1/offerTags");
  return response.data.offerTags; // 👈 plural
}

// Get a Category
export async function getOfferTag(id: string | number) {
  const response = await axios.get(`/api/v1/offerTag/${id}`);
  return response.data.offerTag;
}

// Create category
export async function createOfferTag(data: {
  name: string;
  image?: string;
  url: string;
  featured?: boolean;
}) {
  const response = await axios.post("/api/v1/offerTag", data);
  return response.data.offerTag;
}

export async function upsertOfferTag(category: {
  id?: string;
  name: string;
  image?: string;
  url: string;
  featured?: boolean;
}) {
  const response = await axios.post("/api/v1/offerTag/upsert", category);
  return response.data.offerTag;
}

//  Update Category
export async function updateOfferTag(data: {
  id: number;
  name?: string;
  image?: string;
  url?: string;
  featured?: boolean;
}) {
  const response = await axios.put(`/api/v1/offerTag/${data.id}`, data);
  return response.data.offerTag; // returns the updated user from Laravel
}

// Delete Category
export async function deleteOfferTag(id: string | number) {
  const response = await axios.delete(`/api/v1/offerTag/${id}`);
  return response.data;
}
