import { Status, Role } from "./user";

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

export type StoreType = {
  name: string;
  description: string;
  email: string;
  phone: string;
  logo: string;
  cover: string;
  url: string;
  defaultShippingService: string;
  defaultDeliveryTimeMax?: number;
  defaultDeliveryTimeMin?: number;
  defaultShippingFeeFixed?: number;
  defaultShippingFeeForAdditionalItem?: number;
  defaultShippingFeePerItem?: number;
  defaultShippingFeePerKg?: number;
  returnPolicy?: string;
};

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

export type AdminStoreType = {
  user: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    picture: string;
    status: Status;
    role: Role;
    type: string | null;
    address: string | null;
    state: string | null;
    country: string | null;
    passport: string | null;
    phone: string | null;
    nin: string | null;
    password: string | null;
  };
} & {
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
};

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

export interface StorePageDetails {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  cover: string | null;
  averageRating: number;
  numReviews: number;
}

export interface StorePageDetailsResponse {
  success: boolean;
  data: StorePageDetails;
  error?: string;
}

// types/store.ts
export interface FollowStoreResponse {
  success: boolean;
  message: string;
  data: {
    isFollowing: boolean;
    followersCount: number;
  };
  error?: string;
}
