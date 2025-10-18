import axios from "@/lib/axios";

// Get all country
export async function getAllCountries() {
  const response = await axios.get("/api/v1/countries");
  return response.data.countries; // 👈 plural
}
