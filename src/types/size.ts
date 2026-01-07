// export interface Size {
//   id: string;
//   size: string;
//   quantity: string;
//   price: string;
//   discount: string;
//   wishlist: string;
//   productVariantId: string;
// }

export type Size = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  size: string;
  quantity: number;
  discount: number;
  price: number;
  // wishlist: string;
  productVariantId: string;
};

export interface ApiSize {
  id: number;
  size: string;
  quantity: number;
  discount: number;
  price: number;
  product_variant_id: number;
  created_at: string;
  updated_at: string;
}
