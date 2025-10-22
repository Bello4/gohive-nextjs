import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function AppMenu({ categories }: { categories: Category[] }) {
  return (
    <>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/browse?category=${category.url}`}
          className="text-[#222] shadow-sm bg-white flex flex-col items-center rounded-xl"
        >
          <div className="flex flex-col items-center rounded-2xl">
            <div className="h-[70px] cursor-pointer w-full rounded-2xl flex items-center justify-center">
              <Image
                src={category.image}
                alt={category.name}
                width={80}
                height={80}
                className="w-[52px] h-[52px]" // shrink so it fits in the box
              />
            </div>
            <div className="text-xs text-center font-bold pb-1 text-gray-900">
              {category.name}
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
