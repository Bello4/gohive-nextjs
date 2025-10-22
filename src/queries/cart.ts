import axios from "@/lib/axios";
import {
  CartProductType,
  UpdateCartResponse,
  SaveCartResponse,
} from "@/types/cart";

export async function updateCartWithLatest(
  cartProducts: CartProductType[]
): Promise<CartProductType[]> {
  const response = await axios.post<UpdateCartResponse>(
    "/api/v1/cart/update-with-latest",
    { cartProducts }
  );

  return response.data.data;
}

export async function saveUserCart(
  cartProducts: CartProductType[]
): Promise<boolean> {
  const response = await axios.post<SaveCartResponse>("/api/v1/cart/save", {
    cartProducts,
  });

  return response.data.success;
}
