export interface Store {
  id: number;
  name: string;
  description: string;
  email: string;
  phone: string;
  url: string;
  logo: string;
  cover: string;
  status: string;
  averageRating: number;
  numReviews: number;
  featured: boolean;
  returnPolicy: string;
  defaultShippingService: string;
  defaultShippingFeePerItem: number;
  defaultShippingFeeForAdditionalItem: number;
  defaultShippingFeePerKg: number;
  defaultShippingFeeFixed: number;
  defaultDeliveryTimeMin: number;
  defaultDeliveryTimeMax: number;

  userId: number;
}

export enum StoreStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
  DISABLED = "DISABLED",
}

export interface StoreDetails {
  name: string;
  id: number;
  returnPolicy: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  status: StoreStatus;
  phone: string;
  description: string;
  url: string;
  logo: string;
  cover: string;
  averageRating: number;
  numReviews: number;
  featured: boolean;
  defaultShippingService: string;
  defaultShippingFeePerItem: number;
  defaultShippingFeeForAdditionalItem: number;
  defaultShippingFeePerKg: number;
  defaultShippingFeeFixed: number;
  defaultDeliveryTimeMin: number;
  defaultDeliveryTimeMax: number;
  userId: number;
}

export interface StoreProductType {
  id: number | string;
  name: string;
  description?: string;
  brand?: string;
  slug: string;
  category?: {
    id: number | string;
    name: string;
  } | null;
  subCategory?: {
    id: number | string;
    name: string;
  } | null;
  offerTag?: {
    id: number | string;
    name: string;
  } | null;
  variants: ProductVariantType[];
  store: {
    id: number | string;
    url: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariantType {
  id: number | string;
  variantName: string;
  variantDescription?: string;
  slug?: string;
  sku?: string;
  weight?: number | string;
  isSale?: boolean;
  saleEndDate?: string | null;
  keywords?: string;
  variantImage?: string;
  images?: ProductVariantImageType[];
  colors?: ProductVariantColorType[];
  sizes?: ProductVariantSizeType[];
}

export interface ProductVariantImageType {
  id: number | string;
  url: string;
  order?: number;
}

export interface ProductVariantColorType {
  id: number | string;
  name: string;
}

export interface ProductVariantSizeType {
  id: number | string;
  size: string;
  price: number;
  quantity: number;
  discount?: number;
}

export type StoreDefaultShippingType = {
  returnPolicy?: string;
  defaultShippingService: string;
  defaultShippingFeePerItem: number;
  defaultShippingFeeForAdditionalItem: number;
  defaultShippingFeePerKg: number;
  defaultShippingFeeFixed: number;
  defaultDeliveryTimeMin: number;
  defaultDeliveryTimeMax: number;
};
