import { ShippingFeeMethod } from "./shippingmethod";
import { Review } from "./review";
import { Spec } from "./spec";
import { Color } from "./color";
import { Size } from "./size";
import { Question } from "./question";

export type SimpleProduct = {
  name: string;
  slug: string;
  variantName: string;
  variantSlug: string;
  price: number;
  image: string;
};

export type ProductShippingDetailsType = {
  shippingFeeMethod: string;
  shippingService: string;
  shippingFee: number;
  extraShippingFee: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  returnPolicy: string;
  countryCode: string;
  countryName: string;
  city: string;
  isFreeShipping: boolean;
};

export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  brand: string;
  rating: number;
  sales: number;
  numReviews: number;
  shippingFeeMethod: ShippingFeeMethod;
  views: number;
  freeShippingForAllCountries: boolean;
  createdAt: string;
  updatedAt: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  offerTagId: string | null;

  // Relationships (optional)
  // store?: Store;
  // category?: Category;
  // subCategory?: SubCategory;
  // offerTag?: OfferTag;
  // variants?: ProductVariant[];
  // specs?: Spec[];
  // questions?: Question[];
  // reviews?: Review[];
  // wishlist?: Wishlist[];
  // freeShipping?: FreeShipping;
}

export interface ProductVariant {
  id: string;
  variantName: string;
  variantDescription: string | null;
  variantImage: string;
  slug: string;
  isSale: boolean;
  saleEndDate: string | null;
  sku: string;
  keywords: string;
  sales: number;
  weight: number;
  productId: string;
  createdAt: string;
  updatedAt: string;

  // Relationships (optional)
  // product?: Product;
  // sizes?: Size[];
  // images?: ProductVariantImage[];
  // colors?: Color[];
  // specs?: Spec[];
  // wishlist?: Wishlist[];
}

// Product + variant
export type ProductWithVariantType = {
  productId?: string | null;
  variantId?: string | null;
  name: string;
  description: string;
  variantName: string;
  variantDescription: string;
  images: { id?: string; url: string }[];
  variantImage: string;
  categoryId: string;
  offerTagId: string;
  subCategoryId: string;
  isSale: boolean;
  saleEndDate?: string;
  brand: string;
  sku: string;
  weight: number;
  colors: { id?: string; color: string }[];
  sizes: {
    id?: string;
    size: string;
    quantity: number;
    price: number;
    discount: number;
  }[];
  product_specs: { id?: string; name: string; value: string }[];
  variant_specs: { id?: string; name: string; value: string }[];
  keywords: string[];
  questions: { id?: string; question: string; answer: string }[];
  freeShippingForAllCountries: boolean;
  freeShippingCountriesIds: { id?: string; label: string; value: string }[];
  shippingFeeMethod: ShippingFeeMethod;
};

export enum ProductStatus {
  Pending = "Pending",
  Processing = "Processing",
  ReadyForShipment = "ReadyForShipment",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Canceled = "Canceled",
  Returned = "Returned",
  Refunded = "Refunded",
  FailedDelivery = "FailedDelivery",
  OnHold = "OnHold",
  Backordered = "Backordered",
  PartiallyShipped = "PartiallyShipped",
  ExchangeRequested = "ExchangeRequested",
  AwaitingPickup = "AwaitingPickup",
}

export interface ProductSize {
  id: string;
  size: string;
  price: number;
  discount: number;
  quantity: number;
}

export interface ProductVariantImage {
  id: string;
  order: number | null;
  alt: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  productVariantId: string;
}

export interface VariantSimplified {
  variantId: string;
  variantSlug: string;
  variantName: string;
  images: ProductVariantImage[];
  sizes: Size[];
}

export interface VariantImageType {
  url: string;
  image: string;
}

export type FiltersQueryType = {
  search: string;
  category: string;
  subCategory: string;
  offer: string;
  size: string;
  sort: string;
};

export interface ProductType {
  id: string;
  slug: string;
  name: string;
  rating: number;
  sales: number;
  numReviews: number;
  variants: VariantSimplified[];
  variantImages: VariantImageType[];
}

export interface ProductCardType {
  id: string;
  slug: string;
  name: string;
  rating: number;
  sales: number;
  numReviews: number;
  variants: VariantSimplified[];
  variantImages: VariantImageType[];
}

export type CartProductType = {
  productId: string;
  variantId: string;
  productSlug: string;
  // variantUrl: string;
  variantSlug: string;
  name: string;
  variantName: string;
  image: string;
  variantImage: string;
  sizeId: string;
  size: string;
  quantity: number;
  price: number;
  stock: number;
  weight: number;
  shippingMethod: string;
  shippingService: string;
  shippingFee: number;
  extraShippingFee: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isFreeShipping: boolean;
};

export interface ProductFilters {
  store?: string;
  category?: string;
  subCategory?: string;
  size?: string[];
  offer?: string;
  search?: string;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: ProductCardType[];
    totalPages: number;
    currentPage: number;
    pageSize: number;
    totalCount: number;
  };
  error?: string;
}

// types/product.ts
export interface SizeFilter {
  size: string;
}

export interface FilteredSizesResponse {
  sizes: SizeFilter[];
  count: number;
}

export interface SizeFilters {
  category?: string;
  subCategory?: string;
  offer?: string;
  storeUrl?: string;
}

export interface FilteredSizesApiResponse {
  success: boolean;
  data: FilteredSizesResponse;
  error?: string;
}

// types/product.ts
export interface ProductPageData {
  productId: string;
  variantId: string;
  productSlug: string;
  variantSlug: string;
  variantUrl: string;
  sku: string;
  colors: Color[];
  isSale: boolean;
  saleEndDate: string | null;
  name: string;
  description: string;
  variantDescription: string;
  variantName: string;
  variantImage: string;
  weight: number;
  shippingFeeMethod: string;
  questions: Question[];
  sizes: Size[];
  images: {
    id: string;
    order: number | null;
    alt: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
    productVariantId: string;
  }[];
  product: {
    id: string;
    name: string;
    description: string;
    slug: string;
    brand: string;
    rating: number;
    sales: number;
    numReviews: number;
    views: number;
    shippingFeeMethod: string;
    createdAt: string;
    updatedAt: string;
  };
  variantsInfo: {
    id: string;
    variantName: string;
    variantDescription: string | null;
    variantImage: string;
    slug: string;
    isSale: boolean;
    saleEndDate: string | null;
    sku: string;
    keywords: string;
    sales: number;
    weight: number;
    sizes: Size[];
    images: ProductVariantImage[];
    colors: Color[];
    specs: Spec[];
  }[];
  store: {
    id: string;
    name: string;
    url: string;
    logo: string | null;
    averageRating: number;
    numReviews: number;
    followersCount: number;
    isUserFollowing: boolean;
  };
  category: {
    id: string;
    name: string;
    url: string;
  } | null;
  subCategory: {
    id: string;
    name: string;
    url: string;
  } | null;
  offerTag: {
    id: string;
    name: string;
    url: string;
  } | null;
  shippingDetails: {
    shippingFee: number;
    extraShippingFee: number;
    isFreeShipping: boolean;
    deliveryTimeMin: number;
    deliveryTimeMax: number;
    shippingService: string;
    shippingFeeMethod: string;
  };
  reviewsStatistics: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      [key: number]: {
        count: number;
        percentage: number;
      };
    };
  };
  specs: {
    product: {
      name: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      productId: string | null;
      variantId: string | null;
      value: string;
    }[];
    variant: {
      name: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      productId: string | null;
      variantId: string | null;
      value: string;
    }[];
  };
  reviews: Review[];
  rating: number;
}

export interface GetProductPageData {
  productId: string;
  variantId: string;
  productSlug: string;
  variantSlug: string;
  name: string;
  description: string;
  variantName: string;
  variantDescription: string | null;
  images: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    url: string;
    order: number | null;
    productVariantId: string;
    alt: string;
  }[];
  category: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    url: string;
    featured: boolean;
    image: string;
  };
  subCategory: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    url: string;
    featured: boolean;
    image: string;
    categoryId: string;
  };

  variantsInfo: {
    variantName: string;
    variantSlug: string;
    variantImage: string;
    variantUrl: string;
    images: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      url: string;
      order: number | null;
      productVariantId: string;
      alt: string;
    }[];
    sizes: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      size: string;
      quantity: number;
      discount: number;
      price: number;
      productVariantId: string;
    }[];
    colors: {
      name: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      productVariantId: string;
    }[];
  }[];
  store: {
    name: string;
    id: string;
    email: string;
    userId: string;
    url: string;
    logo: string | null;
    averageRating: number;
    numReviews: number;
    followersCount: number;
    isUserFollowing: boolean;
  };

  offerTagId: string | null;
}

export interface ProductPageDataResponse {
  success: boolean;
  data: ProductPageData;
  error?: string;
}

export interface RatingStatistic {
  rating: number;
  numReviews: number;
  percentage: number;
}
