// export type CartProductType = {
//   productId: string;
//   variantId: string;
//   productSlug: string;
//   variantSlug: string;
//   name: string;
//   variantName: string;
//   image: string;
//   variantImage: string;
//   sizeId: string;
//   size: string;
//   quantity: number;
//   price: number;
//   stock: number;
//   weight: number;
//   shippingMethod: string;
//   shippingService: string;
//   shippingFee: number;
//   extraShippingFee: number;
//   deliveryTimeMin: number;
//   deliveryTimeMax: number;
//   isFreeShipping: boolean;
// };

// types/cart.ts
export interface CartProductType {
  productId: string;
  variantId: string;
  sizeId: string;
  quantity: number;
  productSlug?: string;
  variantSlug?: string;
  sku?: string;
  name?: string;
  variantName?: string;
  image?: string;
  variantImage?: string;
  stock?: number;
  weight?: number;
  shippingMethod?: string;
  size?: string;
  price?: number;
  shippingService?: string;
  shippingFee?: number;
  extraShippingFee?: number;
  deliveryTimeMin?: number;
  deliveryTimeMax?: number;
  isFreeShipping?: boolean;
}

export interface UpdateCartResponse {
  success: boolean;
  data: CartProductType[];
  error?: string;
}

// types/cart.ts
// export interface CartProductType {
//   productId: string;
//   variantId: string;
//   sizeId: string;
//   quantity: number;
//   productSlug?: string;
//   variantSlug?: string;
//   sku?: string;
//   name?: string;
//   image?: string;
//   size?: string;
//   price?: number;
//   shippingFee?: number;
//   totalPrice?: number;
//   storeId?: string;
// }

export interface SaveCartResponse {
  success: boolean;
  message: string;
  data: {
    cartId: string;
    subTotal: number;
    shippingFees: number;
    total: number;
    itemCount: number;
  };
  error?: string;
}
