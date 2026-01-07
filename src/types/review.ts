import { User } from "./user";
import { Color } from "./color";
import { Size } from "./size";
import { ProductVariantImage } from "./product";

export interface Review {
  size: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  review: string;
  variant: string;
  rating: number;
  color: string;
  quantity: string;
  likes: number;
  productId: string;
}
export interface ReviewImage {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
  alt: string;
  reviewId: string;
}

export type RatingStatistics = {
  rating: number;
  numReviews: number;
  percentage: number;
};

export type RatingStatisticsType = {
  ratingStatistics: RatingStatistics[];
  reviewsWithImagesCount: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: {
      count: number;
      percentage: number;
    };
  };
};

export type ReviewsFiltersType = {
  rating?: number;
  hasImages?: boolean;
};

export type ReviewsOrderType = {
  orderBy: "latest" | "oldest" | "highest";
};

export interface ReviewUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

// export interface Review {
//   id: string;
//   rating: number;
//   title?: string;
//   comment?: string;
//   createdAt: string;
//   updatedAt: string;
//   user: ReviewUser;
//   images: ReviewImage[];
// }

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

// export type ReviewWithImageType = Review & {
//   images: ReviewImage[];
//   user: User;
// };

export type ReviewWithImageType = {
  review: Review;
  images: ReviewImage[];
  user: User;
};

export interface UpsertReviewResponse {
  success: boolean;
  message: string;
  data: Review;
  error?: string;
}
