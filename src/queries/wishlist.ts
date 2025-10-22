import axios from "@/lib/axios";
// lib/api/wishlist.ts
import {
  AddToWishlistRequest,
  WishlistItem,
  AddToWishlistResponse,
} from "@/types/wishlist";

export async function addToWishlist(
  productId: string,
  variantId: string,
  sizeId?: string
): Promise<WishlistItem> {
  const response = await axios.post<AddToWishlistResponse>(
    "/api/v1/wishlist/add",
    {
      productId,
      variantId,
      sizeId,
    }
  );

  return response.data.data;
}
