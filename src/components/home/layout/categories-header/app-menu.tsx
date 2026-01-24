"use client";

import { useState, useEffect } from "react";
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
import { getallChatbot } from "@/queries/chatbot";
import { Chatbot } from "@/types/chatbot";

// Define the category type
// interface Category {
//   id: string;
//   name: string;
//   icon: any; // Using any for image imports, you can type this better if needed
//   locked: boolean;
//   href?: string; // Optional link for navigation
// }

export default function AppMenu() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChatbots();
  }, []);

  const fetchChatbots = async () => {
    try {
      const chatData = await getallChatbot();
      setChatbots(chatData);
    } catch (error) {
      console.error("Error fetching chatbots:", error);
    } finally {
      setLoading(false);
    }
  };
  // Static categories array
  // const categories: Category[] = [
  //   {
  //     id: "ride",
  //     name: "Courier",
  //     icon: Rider,
  //     locked: false,
  //     href: "logistic/recieve",
  //   },
  //   {
  //     id: "restaurant",
  //     name: "Restaurants",
  //     icon: Restuarant,
  //     locked: false,
  //     href: "/stores?category=restaurants",
  //   },
  //   {
  //     id: "pharmacy",
  //     name: "Pharmacies",
  //     icon: Pharmacy,
  //     locked: false,
  //     href: "/stores?category=pharmacies",
  //   },
  //   {
  //     id: "parcel",
  //     name: "Gifts",
  //     icon: SuperMarket,
  //     locked: false,
  //     href: "/stores",
  //   },
  // ];

  return (
    <div className="justify-center  p-2 items-center mt-4">
      <div className="flex mb-4 py-2">
        <h2 className="text-2xl md:text-5xl font-bold bg-gradient-to-b from-gray-900 to-gray-300 bg-clip-text text-transparent">
          Welcome to HiveGo,
          <br /> Your Personal Rider Service. <br />
        </h2>
        {/* <div></div> */}
        {/* <Link
          href="/stores"
          className="px-4 py-2  text-gray-600 underline text-sm font-bold rounded-lg transition-colors duration-200"
        >
          View More
        </Link> */}
      </div>

      {/* <div className="grid ml-6 grid-cols-4 text-center gap-2 justify-center items-center my-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div> */}

      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {chatbots.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* <AppMenuCard categories={categories} /> */}
    </div>
  );
}

// Separate component for each category card
interface CategoryCardProps {
  category: Chatbot;
}

function CategoryCard({ category }: CategoryCardProps) {
  const cardContent = (
    <div className="text-[#222] border border-gray-200 rounded-lg shadow-lg bg-white flex flex-col items-center relative">
      {/* Lock Icon - only show if category is locked */}
      {/* {category.locked && (
        <div className="w-full relative pt-1 right-0 left-0 top-0 z-10">
          <Image width="20" src={Lock} alt="Lock Icon" />
        </div>
      )} */}

      {/* Category Icon */}
      <div className="flex flex-col items-center  rounded-lg  ">
        {/* <div
          className={`h-[75px] w-[98px] cursor-pointer flex items-center justify-center ${
            category.locked ? "opacity-50" : ""
          }`}
        ></div> */}
        <div
          className={`h-[75px] w-[98px] cursor-pointer flex items-center justify-center`}
        >
          <Image
            width={1000}
            height={1000}
            src={category.image}
            alt={category.name}
            className="w-[85px] h-[65px]"
          />
        </div>
      </div>

      {/* Category Name */}
      <div className="text-xs px-2 text-center font-bold text-gray-900 mt-1">
        {category.name}
      </div>
    </div>
  );

  // Wrap with Link if not locked and href is provided
  return <Link href={`/chatbot/${category.id}`}>{cardContent}</Link>;

  return cardContent;
}
