import Link from "next/link";
import Image from "next/image";
import AppMenuCard from "./app-menu-card";

// Logo image
import LogoImg from "../../../../../public/assets/icons/parcel.png";
import Restuarant from "../../../../../public/assets/icons/resturant.png";
import Pharmacy from "../../../../../public/assets/icons/pharmacy.png";
import SuperMarket from "../../../../../public/assets/icons/supermarket.png";
import Lock from "../../../../../public/assets/icons/lock.png";
import Rider from "../../../../../public/assets/icons/orderride.png";

// Define the category type
interface Category {
  id: string;
  name: string;
  icon: any; // Using any for image imports, you can type this better if needed
  locked: boolean;
  href?: string; // Optional link for navigation
}

export default async function AppMenu() {
  // Static categories array
  const categories: Category[] = [
    {
      id: "ride",
      name: "Order Ride",
      icon: Rider,
      locked: false,
      href: "/logistic/recieve",
    },
    {
      id: "restaurant",
      name: "Restaurants",
      icon: Restuarant,
      locked: false,
      href: "/stores?category=restaurants",
    },
    {
      id: "pharmacy",
      name: "Pharmacies",
      icon: Pharmacy,
      locked: false,
      href: "/pharmacies",
    },
    {
      id: "supermarket",
      name: "SuperMarkets",
      icon: SuperMarket,
      locked: true,
      href: "/stores?category=",
    },
    {
      id: "parcel",
      name: "More",
      icon: LogoImg,
      locked: false,
      href: "/stores",
    },
  ];

  return (
    <div className="justify-center items-center mt-4">
      <div className="text-center h-[32px] leading-[32px] text-[24px] font-extrabold text-[#222] flex justify-center">
        <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
        <span>Categories</span>
        <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
      </div>

      <div className="grid ml-6 grid-cols-4 text-center gap-2 justify-center items-center my-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {/* <AppMenuCard categories={categories} /> */}
    </div>
  );
}

// Separate component for each category card
interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  const cardContent = (
    <div className="text-[#222] flex flex-col items-center relative">
      {/* Lock Icon - only show if category is locked */}
      {category.locked && (
        <div className="w-full relative pt-1 right-0 left-0 top-0 z-10">
          <Image width="20" src={Lock} alt="Lock Icon" />
        </div>
      )}

      {/* Category Icon */}
      <div className="flex flex-col items-center shadow-sm bg-white rounded-full">
        <div
          className={`h-[65px] w-[65px] cursor-pointer flex items-center justify-center ${
            category.locked ? "opacity-50" : ""
          }`}
        >
          <Image
            src={category.icon}
            alt={category.name}
            className="w-[40px] h-[40px]"
          />
        </div>
      </div>

      {/* Category Name */}
      <div className="text-xs text-center font-bold text-gray-900 mt-1">
        {category.name}
      </div>
    </div>
  );

  // Wrap with Link if not locked and href is provided
  if (!category.locked && category.href) {
    return <Link href={category.href}>{cardContent}</Link>;
  }

  return cardContent;
}
