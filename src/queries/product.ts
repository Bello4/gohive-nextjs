import axios from "@/lib/axios";
import { ProductWithVariantType } from "@/types/product";

export async function getAllStoreProducts(storeUrl: string) {
  const res = await axios.get(`/api/v1/stores/${storeUrl}/products`);
  return res.data.products;
}

// // Get all Products
// export async function getAllStoreProducts() {
//   const response = await axios.get("/api/v1/products");
//   return response.data.products; // 👈 plural
// }

// export const upsertProduct = async (product: ProductWithVariantType, storeUrl: string) => {
//   const response = await axios.post("/api/v1/products/upsert", {
//     storeUrl,
//     ...product,
//   });

//   return response.data.product;
// };

// Function: getProductVariant
// Description: Retrieves details of a specific product variant from the database.
// Access Level: Public
// Parameters:
//   - productId: The id of the product to which the variant belongs.
//   - variantId: The id of the variant to be retrieved.
// Returns: Details of the requested product variant.
export const getProductVariant = async (
  productId: string,
  variantId: string
) => {
  const response = await axios.get(
    `/api/v1/products/${productId}/variants/${variantId}`
  );
  return response.data.data; // The 'data' key holds your structured variant object
};

// Function: getProductMainInfo
// Description: Retrieves the main information of a specific product from the database.
// Access Level: Public
// Parameters:
//   - productId: The ID of the product to be retrieved.
// Returns: An object containing the main information of the product or null if the product is not found.

export const getProductMainInfo = async (productId: string) => {
  const res = await axios.get(`/api/v1/products/${productId}/main-info`);
  return res.data.data; // Accessing the 'data' object from the API response
};

/**
 * Function: upsertProduct
 * Description: Sends product and variant data to the backend to create or update a product.
 * Access Level: Seller Only
 *
 * @param product - The product with its variant and related details
 * @param storeUrl - The store's URL to which the product belongs
 * @returns The newly created or updated product
 */
export const upsertProduct = async (
  product: ProductWithVariantType,
  storeUrl: string
) => {
  try {
    const response = await axios.post("/api/v1/products/upsert", {
      storeUrl,
      ...product,
    });

    return response.data.product; // backend should return { product: ... }
  } catch (error: any) {
    console.error(
      "Error upserting product:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete Category
export async function deleteProduct(id: string | number) {
  const response = await axios.delete(`/api/v1/categories/${id}`);
  return response.data;
}
