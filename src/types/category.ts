import { SubCategory } from "./subCategory";
export interface Category {
  id: number;
  name: string;
  image: string;
  url: string;
  featured: boolean;
}

export interface FeaturedSubCategory {
  id: string;
  name: string;
  url: string;
  image: string | null;
  productCount: number;
}

export interface FeaturedCategory {
  id: string;
  name: string;
  url: string;
  image: string | null;
  productCount: number;
  subCategories: FeaturedSubCategory[];
}

export interface FeaturedCategoriesResponse {
  success: boolean;
  data: FeaturedCategory[];
  error?: string;
}

export type FeaturedCategoryType = {
  id: string;
  name: string;
  url: string;
  productCount: number;
  image: string | null;
  subCategories: {
    id: string;
    name: string;
    url: string;
    image: string;
    productCount: number;
  }[];
};

export type CatgegoryWithSubsType = Category & {
  subCategories: SubCategory[];
};
