import { Color } from "./color";
import { Size } from "./size";
import { ProductVariantImage } from "./product";

export type VariantImageType = {
  url: string;
  image: string;
};

export type VariantInfoType = {
  variantName: string;
  // variantSlug: string;
  variantImage: string;
  variantUrl: string;
  images: ProductVariantImage[];
  sizes: Size[];
  colors: Color[];
};
