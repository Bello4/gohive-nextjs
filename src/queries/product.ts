import axios from "@/lib/axios";
import {
  ProductWithVariantType,
  ProductCardType,
  ProductFilters,
  ProductsResponse,
} from "@/types/product";
import {
  ProductPageData,
  ProductPageDataResponse,
  FilteredSizesApiResponse,
  FilteredSizesResponse,
  SizeFilters,
} from "@/types/product";

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

// Function: getProducts
// Description: Retrieves products based on various filters and returns only variants that match the filters. Supports pagination.
// Access Level: Public
// Parameters:
//   - filters: An object containing filter options (category, subCategory, offerTag, size, onSale, onDiscount, brand, color).
//   - sortBy: Sort the filtered results (Most popular, New Arivals, Top Rated...).
//   - page: The current page number for pagination (default = 1).
//   - pageSize: The number of products per page (default = 10).
// Returns: An object containing paginated products, filtered variants, and pagination metadata (totalPages, currentPage, pageSize, totalCount).

export async function getProducts(
  filters: ProductFilters = {},
  sortBy: string = "",
  page: number = 1,
  pageSize: number = 10
): Promise<{
  products: ProductCardType[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
}> {
  try {
    const params = new URLSearchParams();

    // Add filters - use the same field names as your Laravel controller expects
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    // Add other parameters
    if (sortBy) params.append("sortBy", sortBy);
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    // console.log("Making API call to:", `/api/v1/products?${params.toString()}`);

    const response = await axios.get(`/api/v1/products?${params.toString()}`, {
      timeout: 10000,
      validateStatus: (status) => status < 500,
    });

    // console.log("API Response status:", response.status);
    // console.log("API Response data:", response.data);

    // Handle different response structures
    if (response.data.success === false) {
      throw new Error(
        response.data.message || response.data.error || "API request failed"
      );
    }

    // Support both response structures:
    // - Direct data: { products: [], ... }
    // - Wrapped data: { success: true, data: { products: [], ... } }
    const responseData = response.data.data || response.data;

    if (!responseData.products) {
      throw new Error("Invalid API response: missing products field");
    }

    return {
      products: responseData.products,
      totalPages: responseData.totalPages,
      currentPage: responseData.currentPage,
      pageSize: responseData.pageSize,
      totalCount: responseData.totalCount,
    };
  } catch (error: any) {
    console.error("Error in getProducts function:");
    console.error(" - Message:", error.message);
    console.error(" - Response data:", error.response?.data);
    console.error(" - Response status:", error.response?.status);

    // Throw a more descriptive error
    if (error.response?.data?.message) {
      throw new Error(`Products API Error: ${error.response.data.message}`);
    }

    if (error.response?.data?.error) {
      throw new Error(`Products API Error: ${error.response.data.error}`);
    }

    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout - please try again");
    }

    if (error.response?.status === 404) {
      throw new Error("Products API endpoint not found");
    }

    throw new Error(`Failed to fetch products: ${error.message}`);
  }
}

export async function getFilteredSizes(
  filters: SizeFilters = {},
  take: number = 10
): Promise<FilteredSizesResponse> {
  const params = new URLSearchParams();

  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  // Add take parameter
  params.append("take", take.toString());

  const response = await axios.get<FilteredSizesApiResponse>(
    `/api/v1/products/filtered-sizes?${params}`
  );

  return response.data.data;
}

// Function: getProductPageData
// Description: Retrieves details of a specific product variant from the database.
// Access Level: Public
// Parameters:
//   - productId: The slug of the product to which the variant belongs.
//   - variantId: The slug of the variant to be retrieved.
// Returns: Details of the requested product variant.
export async function getProductPageData(
  productSlug: string,
  variantSlug: string
): Promise<ProductPageData> {
  const response = await axios.get<ProductPageDataResponse>(
    `/api/v1/products/${productSlug}/${variantSlug}/page-data`
  );

  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to fetch product data");
  }

  return response.data.data;
}

export async function handleProductPage(productSlug: string): Promise<{
  redirect: string;
  product?: any;
  firstVariant?: any;
}> {
  const response = await axios.get(
    `/api/v1/products/${productSlug}/handle-page`
  );

  if (!response.data.success) {
    // If API returns a redirect, use it
    if (response.data.redirect) {
      return { redirect: response.data.redirect };
    }
    throw new Error(response.data.error || "Failed to handle product page");
  }

  return {
    redirect: response.data.redirect!,
    product: response.data.data?.product,
    firstVariant: response.data.data?.firstVariant,
  };
}

// Delete Prouct
export async function deleteProduct(id: string | number) {
  const response = await axios.delete(`/api/v1/categories/${id}`);
  return response.data;
}
