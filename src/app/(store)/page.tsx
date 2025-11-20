import Header from "@/components/home/layout/header/header";
import MobileApp from "@/components/home/layout/footer/mobile-nav";
import Featured from "@/components/home/subhome/main/featured";
import HomeMainSwiper from "@/components/home/subhome/main/home-swiper";
import HomeUserCard from "@/components/home/subhome/main/user/user";
import AppMenu from "@/components/home/layout/categories-header/app-menu";
import { getHomeFeaturedCategories } from "@/queries/home";
import DispatchMenu from "@/components/home/layout/categories-header/dispatch-menu";
// import { getProducts } from "@/queries/product";
import Image from "next/image";
import FeaturedCategories from "@/components/home/subhome/featured-categories";
import ProductCard from "@/components/home/cards/product/product-card";

export default async function Home() {
  // const productsData = await getProducts({}, "", 1, 100);
  // const { products } = productsData;

  // const {
  //   products_super_deals,
  //   products_best_deals,
  //   products_user_card,
  //   products_featured,
  // } = await getHomeDataDynamic([
  //   { property: "offer", value: "best-deals", type: "simple" },
  //   { property: "offer", value: "super-deals", type: "full" },
  //   { property: "offer", value: "user-card", type: "simple" },
  //   { property: "offer", value: "featured", type: "simple" },
  // ]);
  const featuredCategories = await getHomeFeaturedCategories();
  return (
    <>
      <Header />
      <main className="">
        <div className="relative w-full h-full bg-gray-100">
          <div className="max-w-[1600px] mx-auto min-h-screen p-4">
            {/* Main */}
            <div className="w-full grid gap-2 min-[1170px]:grid-cols-[1fr_350px] min-[1465px]:grid-cols-[200px_1fr_350px]">
              {/* Left */}
              <div
                className="cursor-pointer hidden min-[1465px]:block bg-cover bg-no-repeat rounded-md"
                style={{
                  backgroundImage:
                    "url(/assets/ads/winter-sports-clothing.jpg)",
                }}
              />
              {/* Middle */}
              <div className="space-y-2 h-fit">
                {/* Main swiper */}
                <HomeMainSwiper />
                {/* Featured card */}
                {/* <Featured
                  products={products_featured.filter(
                    (product): product is SimpleProduct =>
                      "variantSlug" in product
                  )}
                /> */}
              </div>
              {/* Right */}
              <div className="h-full">
                <HomeUserCard />
              </div>
            </div>
            {/* Animated deals */}
            <div className="mt-2  min-[915px]:block">
              {/* <AnimatedDeals
                products={products_best_deals.filter(
                  (product): product is SimpleProduct =>
                    "variantSlug" in product
                )}
              /> */}
            </div>

            <DispatchMenu />
            <AppMenu />
            <div className="mt-10 space-y-10">
              {/* <FeaturedCategories categories={featuredCategories} /> */}
              {/* <div>
                <div className="text-center h-[32px] leading-[32px] text-[24px] font-extrabold text-[#222] flex justify-center">
                  <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
                  <span>More to love</span>
                  <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
                </div>
                <div className="mt-7 bg-white justify-center flex flex-wrap min-[1530px]:grid min-[1530px]:grid-cols-7 p-4 pb-16 rounded-md">
                  {products.map((product, i) => (
                    <ProductCard key={i} product={product} />
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </main>
      <MobileApp />
    </>
  );
}
