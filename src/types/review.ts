import { User } from "./user";
import { Color } from "./color";
import { Size } from "./product";
import { ProductVariantImage } from "./product";

export interface Review {
  id: string;
  variant: string;
  review: string;
  rating: number;
  color: string;
  size: string;
  quantity: string;
  likes: number;
  userId: string;
  productId: string;
}
export interface ReviewImage {
  id: string;
  url: string;
  alt: string;
  reviewId: string;
}

export type RatingStatisticsType = {
  ratingStatistics: {
    rating: number;
    numReviews: number | null;
    percentage: number;
  }[];
  reviewsWithImagesCount: number;
  totalReviews: number;
};

export type ReviewsFiltersType = {
  rating?: number;
  hasImages?: boolean;
};

export type ReviewsOrderType = {
  orderBy: "latest" | "oldest" | "highest";
};

export type VariantInfoType = {
  variantName: string;
  variantSlug: string;
  variantImage: string;
  variantUrl: string;
  images: ProductVariantImage[];
  sizes: Size[];
  colors: Color[];
};

export interface ReviewUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
  images: ReviewImage[];
}

export interface ReviewFilters {
  rating?: number;
  hasImages?: boolean;
}

export interface ReviewSort {
  orderBy: "latest" | "oldest" | "highest";
}

export interface PaginatedReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    pagination: {
      currentPage: number;
      totalPages: number;
      pageSize: number;
      totalCount: number;
    };
  };
  error?: string;
}

export type ReviewDetailsType = {
  id: string;
  review: string;
  rating: number;
  images: { url: string }[];
  size: string;
  quantity: string;
  variant: string;
  color: string;
};

export type ReviewWithImageType = Review & {
  images: ReviewImage[];
  user: User;
};

export interface UpsertReviewResponse {
  success: boolean;
  message: string;
  data: Review;
  error?: string;
}
