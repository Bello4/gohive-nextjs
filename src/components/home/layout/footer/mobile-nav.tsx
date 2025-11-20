"use client";

import {
  HomeIcon,
  SupportIcon,
  DriverIcon,
  ProfileIcon,
} from "@/components/home/icons";
import Link from "next/link";
// Utils
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function MobileApp() {
  const pathname = usePathname();
  return (
    <div className="fixed inset-x-0 bottom-0 w-full z-50 shadow-lg flex bg-white justify-around pt-2 pb-2 border-t-2 border-t-gray-200">
      <Link
        href="/"
        className={cn(
          "grid place-items-center",
          pathname === "/" ? "" : "text-gray-500"
        )}
      >
        <HomeIcon />
        <div className="w-full mt-1 text-xs text-center font-semibold text-gray-500">
          Home
        </div>
      </Link>

      <Link href="/logistic/orders" className="grid place-items-center">
        <DriverIcon />

        <div className="w-full mt-1 text-xs text-center text-gray-500 font-semibold">
          Orders
        </div>
      </Link>

      <Link href="/" className="grid place-items-center">
        <SupportIcon />

        <div className="w-full mt-1 text-xs text-center text-gray-500 font-semibold">
          Support
        </div>
      </Link>

      <Link href="/profile" className="grid place-items-center">
        <ProfileIcon />

        <div className="w-full mt-1 text-xs text-center text-gray-500 font-semibold">
          Profile
        </div>
      </Link>
    </div>
  );
}
