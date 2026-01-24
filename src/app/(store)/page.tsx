import Header from "@/components/home/layout/header/header";
import MobileApp from "@/components/home/layout/footer/mobile-nav";
import HomeMainSwiper from "@/components/home/subhome/main/home-swiper";
import HomeUserCard from "@/components/home/subhome/main/user/user";
// import DispatchMenu from "@/components/home/layout/categories-header/dispatch-menu";
import StoreSlider from "@/components/home/store-page/store-slider";
import AppMenu from "@/components/home/layout/categories-header/app-menu";

export default async function Home() {
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

            {/* <DispatchMenu /> */}
            <div className="bg-white">
              <AppMenu />
            </div>
            <StoreSlider />
          </div>
        </div>
      </main>
      {/* <MobileApp /> */}
    </>
  );
}
