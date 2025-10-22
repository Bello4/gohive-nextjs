import { getAllCategories } from "@/queries/category";
import Link from "next/link";
import Image from "next/image";
import AppMenuCard from "./app-menu-card";

// Logo image
import LogoImg from "../../../../../public/assets/icons/parcel.png";
import Restuarant from "../../../../../public/assets/icons/resturant.png";
import Pharmacy from "../../../../../public/assets/icons/pharmacy.png";
import SuperMarket from "../../../../../public/assets/icons/supermarket.png";
import Lock from "../../../../../public/assets/icons/lock.png";

export default async function AppMenu() {
  const categories = await getAllCategories();

  // Fetch all offer tags
  // const offerTags = await getAllOfferTags();

  return (
    <div>
      <div className="text-center h-[32px] leading-[32px] text-[24px] font-extrabold text-[#222] flex justify-center">
        <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
        <span>Categories</span>
        <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
      </div>
      <div className="grid grid-cols-4 text-center  gap-2 justify-center items-center my-4">
        <div>
          <div className=" absolute text-[#222]  flex flex-col items-center ">
            <div className="w-full relative pt-1 right-0 left-0 top-0 z-10">
              <Image width="30" src={Lock} alt="Lock Icon" />
            </div>
            <div className="flex flex-col  items-center shadow-sm bg-white rounded-full">
              <div className="h-[65px] w-[65px] cursor-pointer   flex items-center justify-center">
                <Image
                  src={Restuarant}
                  alt="parcel"
                  className="w-[40px] h-[40px]" // shrink so it fits in the box
                />
              </div>
            </div>
            <div className="text-xs text-center font-bold  text-gray-900">
              Restuarant
            </div>
          </div>
        </div>

        <div>
          <div className=" absolute  text-[#222]  flex flex-col items-center ">
            <div className="w-full relative pt-1 right-0 left-0 top-0 z-10">
              <Image width="30" src={Lock} alt="Lock Icon" />
            </div>
            <div className="flex flex-col  items-center shadow-sm bg-white rounded-full">
              <div className="h-[65px] w-[65px] cursor-pointer   flex items-center justify-center">
                <Image
                  src={Pharmacy}
                  alt="parcel"
                  className="w-[40px] h-[40px]" // shrink so it fits in the box
                />
              </div>
            </div>
            <div className="text-xs text-center font-bold  text-gray-900">
              Pharmacy
            </div>
          </div>
        </div>

        <div>
          <div className=" absolute text-[#222]  flex flex-col items-center ">
            <div className="w-full relative pt-1 right-0 left-0 top-0 z-10">
              <Image width="30" src={Lock} alt="Lock Icon" />
            </div>
            <div className="flex flex-col  items-center shadow-sm bg-white rounded-full">
              <div className="h-[65px] w-[65px] cursor-pointer   flex items-center justify-center">
                <Image
                  src={SuperMarket}
                  alt="parcel"
                  className="w-[40px] h-[40px]" // shrink so it fits in the box
                />
              </div>
            </div>
            <div className="text-xs text-center font-bold  text-gray-900">
              SuperMarket
            </div>
          </div>
        </div>
        <div>
          <div className="absolute   text-[#222]  flex flex-col items-center ">
            <div className="w-full relative pt-1 right-0 left-0 top-0 z-10">
              <Image width="30" src={Lock} alt="Lock Icon" />
            </div>
            <div className="flex flex-col  items-center shadow-sm bg-white rounded-full">
              <div className="h-[65px] w-[65px] cursor-pointer    flex items-center justify-center">
                <Image
                  src={LogoImg}
                  alt="parcel"
                  className="w-[40px] h-[40px]" // shrink so it fits in the box
                />
              </div>
            </div>
            <div className="text-xs text-center font-bold  text-gray-900">
              More
            </div>
          </div>
        </div>
        {/* <AppMenuCard categories={categories} /> */}
      </div>
    </div>
  );
}
