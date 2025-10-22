import { Product, ProductVariant } from "./product";
import { Size } from "./size";
// types/wishlist.ts
export interface AddToWishlistRequest {
  productId: string;
  variantId: string;
  sizeId?: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  variantId: string;
  sizeId: string | null;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  variant?: ProductVariant;
  size?: Size;
}

export interface AddToWishlistResponse {
  success: boolean;
  message: string;
  data: WishlistItem;
  error?: string;
}
