"use client";
import { CartProductType, ProductPageData } from "@/types/product";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import ProductSwiper from "./product-swiper";
import ProductInfo from "./product-info/product-info";
import ShipTo from "./shipping/ship-to";
import ShippingDetails from "./shipping/shipping-details";
import ReturnPrivacySecurityCard from "./returns-security-privacy-card";
import { cn, isProductValidToAdd, updateProductHistory } from "@/lib/utils";
import QuantitySelector from "./quantity-selector";
import SocialShare from "../shared/social-share";
import { ProductVariantImage } from "@/types/product";
import { useCartStore } from "@/cart-store/useCartStore";
import toast from "react-hot-toast";
import useFromStore from "@/hooks/useFromStore";
import { setCookie } from "cookies-next";

interface Props {
  productData: ProductPageData;
  sizeId: string | undefined;
  children: ReactNode;
}

const ProductPageContainer: FC<Props> = ({ productData, sizeId, children }) => {
  // 1. ALL hooks must be at the top, unconditionally
  const [variantImages, setVariantImages] = useState<ProductVariantImage[]>([]);
  const [activeImage, setActiveImage] = useState<ProductVariantImage | null>(
    null
  );
  const [productToBeAddedToCart, setProductToBeAddedToCart] =
    useState<CartProductType | null>(null);
  const [isProductValid, setIsProductValid] = useState<boolean>(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const setCart = useCartStore((state) => state.setCart);
  const cartItems = useFromStore(useCartStore, (state) => state.cart);

  // Extract shippingDetails safely - moved before any hooks that use it
  const shippingDetails = productData?.shippingDetails;

  // Initialize product data
  useEffect(() => {
    if (!productData) return;

    const data: CartProductType = {
      productId: productData.productId,
      variantId: productData.variantId,
      productSlug: productData.productSlug,
      variantSlug: productData.variantSlug,
      name: productData.name,
      variantName: productData.variantName,
      image: productData.images[0]?.url || "",
      variantImage: productData.variantImage,
      quantity: 1,
      price: 0,
      sizeId: sizeId || "",
      size: "",
      stock: 1,
      weight: productData.weight,
      shippingMethod:
        shippingDetails && typeof shippingDetails !== "boolean"
          ? shippingDetails.shippingFeeMethod
          : "",
      shippingService:
        shippingDetails && typeof shippingDetails !== "boolean"
          ? shippingDetails.shippingService
          : "",
      shippingFee:
        shippingDetails && typeof shippingDetails !== "boolean"
          ? shippingDetails.shippingFee
          : 0,
      extraShippingFee:
        shippingDetails && typeof shippingDetails !== "boolean"
          ? shippingDetails.extraShippingFee
          : 0,
      deliveryTimeMin:
        shippingDetails && typeof shippingDetails !== "boolean"
          ? shippingDetails.deliveryTimeMin
          : 0,
      deliveryTimeMax:
        shippingDetails && typeof shippingDetails !== "boolean"
          ? shippingDetails.deliveryTimeMax
          : 0,
      isFreeShipping:
        shippingDetails && typeof shippingDetails !== "boolean"
          ? shippingDetails.isFreeShipping
          : false,
    };

    setProductToBeAddedToCart(data);
    setVariantImages(productData.images);
    setActiveImage(productData.images[0] || null);
  }, [productData, sizeId, shippingDetails]);

  // Check if product is valid - MUST be called unconditionally
  useEffect(() => {
    if (productToBeAddedToCart) {
      const check = isProductValidToAdd(productToBeAddedToCart);
      setIsProductValid(check);
    }
  }, [productToBeAddedToCart]);

  // Keeping cart state updated - MUST be called unconditionally
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cart") {
        try {
          const parsedValue = event.newValue
            ? JSON.parse(event.newValue)
            : null;

          if (
            parsedValue &&
            parsedValue.state &&
            Array.isArray(parsedValue.state.cart)
          ) {
            setCart(parsedValue.state.cart);
          }
        } catch (error) {
          console.error("Failed to parse updated cart data:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setCart]);

  // Add product to history - MUST be called unconditionally
  useEffect(() => {
    if (productData?.variantId) {
      updateProductHistory(productData.variantId);
    }
  }, [productData?.variantId]);

  // Set view cookie - MUST be called unconditionally
  useEffect(() => {
    if (productData?.productId) {
      setCookie(`viewedProduct_${productData.productId}`, "true", {
        maxAge: 3600,
        path: "/",
      });
    }
  }, [productData?.productId]);

  const maxQty = useMemo(() => {
    if (!cartItems || !productToBeAddedToCart)
      return productToBeAddedToCart?.stock || 0;

    const search_product = cartItems.find(
      (p) =>
        p.productId === productToBeAddedToCart.productId &&
        p.variantId === productToBeAddedToCart.variantId &&
        p.sizeId === productToBeAddedToCart.sizeId
    );
    return search_product
      ? search_product.stock - search_product.quantity
      : productToBeAddedToCart.stock;
  }, [cartItems, productToBeAddedToCart]);

  const handleAddToCart = () => {
    if (maxQty <= 0 || !productToBeAddedToCart) return;
    addToCart(productToBeAddedToCart);
    toast.success("Product added to cart successfully.");
  };

  // I notice handleChange is referenced but not defined - you'll need to define it
  const handleChange = () => {
    // Define your handleChange logic here
    console.log("handleChange called");
  };

  // 2. Only AFTER all hooks are called, you can have conditional returns
  if (!productData) return null;
  if (typeof shippingDetails === "boolean") return null;

  // 3. Now render your component
  const { productId, variantId, images, sizes } = productData;

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        <ProductSwiper
          images={variantImages.length > 0 ? variantImages : images}
          activeImage={activeImage || images[0]}
          setActiveImage={setActiveImage}
        />
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          {/* Product main info */}
          <ProductInfo
            productData={productData}
            sizeId={sizeId}
            handleChange={handleChange}
            setVariantImages={setVariantImages}
            setActiveImage={setActiveImage}
          />
          {/* Shipping details - buy actions buttons */}
          <div className="w-[390px]">
            <div className="z-20">
              <div className="bg-white border rounded-md overflow-hidden overflow-y-auto p-4 pb-0">
                {typeof shippingDetails !== "boolean" && (
                  <>
                    <ShipTo
                      countryCode={shippingDetails.countryCode}
                      countryName={shippingDetails.countryName}
                      city={shippingDetails.city}
                    />
                    <div className="mt-3 space-y-3">
                      <ShippingDetails
                        shippingDetails={shippingDetails}
                        quantity={1}
                        weight={productData.weight}
                      />
                    </div>
                    <ReturnPrivacySecurityCard
                      returnPolicy={shippingDetails.returnPolicy}
                    />
                  </>
                )}
                {/* Action buttons */}
                <div className="mt-5 bg-white bottom-0 pb-4 space-y-3 sticky">
                  {/* Qty selector */}
                  {productToBeAddedToCart && sizeId && (
                    <div className="w-full flex justify-end mt-4">
                      <QuantitySelector
                        productId={productToBeAddedToCart.productId}
                        variantId={productToBeAddedToCart.variantId}
                        sizeId={productToBeAddedToCart.sizeId}
                        quantity={productToBeAddedToCart.quantity}
                        stock={productToBeAddedToCart.stock}
                        handleChange={handleChange}
                        sizes={sizes}
                      />
                    </div>
                  )}
                  {/* Action buttons */}
                  <button className="relative w-full py-2.5 min-w-20 bg-orange-background hover:bg-orange-hover  h-11 rounded-3xl leading-6 inline-block font-bold whitespace-nowrap border border-orange-border cursor-pointer transition-all duration-300 ease-bezier-1 select-none">
                    <span>Buy now</span>
                  </button>
                  <button
                    disabled={!isProductValid}
                    className={cn(
                      "relative w-full py-2.5 min-w-20 bg-orange-border hover:bg-[#e4cdce] text-orange-hover h-11 rounded-3xl leading-6 inline-block font-bold whitespace-nowrap border border-orange-border cursor-pointer transition-all duration-300 ease-bezier-1 select-none",
                      {
                        "cursor-not-allowed": !isProductValid || maxQty <= 0,
                      }
                    )}
                    onClick={() => handleAddToCart()}
                  >
                    <span>Add to cart</span>
                  </button>
                  {/* Share to socials */}
                  <SocialShare
                    url={`/product/${productData.productSlug}/${productData.variantSlug}`}
                    quote={`${productData.name} · ${productData.variantName}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[calc(100%-390px)] mt-6 pb-16">{children}</div>
    </div>
  );
};

export default ProductPageContainer;
