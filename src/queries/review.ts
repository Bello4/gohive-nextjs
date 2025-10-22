import axios from "@/lib/axios";
// lib/api/reviews.ts
import {
  Review,
  ReviewFilters,
  ReviewSort,
  PaginatedReviewsResponse,
  ReviewDetailsType,
  UpsertReviewResponse,
} from "@/types/review";

export async function getProductFilteredReviews(
  productId: string,
  filters: ReviewFilters = {},
  sort: ReviewSort = { orderBy: "highest" },
  page: number = 1,
  pageSize: number = 4
): Promise<{
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
}> {
  const params = new URLSearchParams();

  // Add filters
  if (filters.rating) params.append("rating", filters.rating.toString());
  if (filters.hasImages) params.append("hasImages", "true");

  // Add sort
  params.append("orderBy", sort.orderBy);

  // Add pagination
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());

  const response = await axios.get(
    `/api/v1/products/${productId}/reviews/filtered?${params}`
  );

  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to fetch reviews");
  }

  return response.data.data;
}

export async function upsertReview(
  productId: string,
  review: ReviewDetailsType
): Promise<Review> {
  const response = await axios.post<UpsertReviewResponse>(
    `/api/v1/products/${productId}/reviews/upsert`,
    review
  );

  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to upsert review");
  }

  return response.data.data;
}
