"use client";

import { MessageIcon, OrderIcon, WishlistIcon } from "@/components/home/icons";
import { Button } from "@/components/home/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
// import { SignOutButton, UserButton } from "@clerk/nextjs";
import { useAuth } from "@/hooks/auth";

import { ChevronDown, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UserMenu() {
  // Get the current user
  //   import { useAuth } from "@/hooks/auth";
  const { user, logout } = useAuth();
  const role = user?.data.role;

  console.log(role);
  return (
    <div className="relative group">
      {/* Trigger */}
      <div>
        {user ? (
          <Image
            src={user.data.picture || "/assets/auth/default-user.jpg"}
            alt={user.data.name!}
            width={40}
            height={40}
            className="w-10 h-10 object-cover rounded-full"
          />
        ) : (
          <div className="flex h-11 items-center py-0 mx-2 cursor-pointer">
            <span className="text-2xl">
              <UserIcon />
            </span>
            <div className="ml-1">
              <span className="block text-xs text-white leading-3">
                Welcome
              </span>
              <b className="font-bold text-xs text-white leading-4">
                <span>Sign in / Register</span>
                <span className="text-white scale-[60%] align-middle inline-block">
                  <ChevronDown />
                </span>
              </b>
            </div>
          </div>
        )}
      </div>
      {/* Content */}
      <div
        className={cn(
          "hidden absolute top-0 -left-20 group-hover:block cursor-pointer",
          {
            "-left-[200px] lg:-left-[160px]": "Brown",
          }
        )}
      >
        <div className="relative left-2 mt-10 right-auto bottom-auto pt-2.5 text-[#222] p-0 text-sm z-40">
          {/* Triangle */}
          <div className="w-0 h-0 absolute left-[149px] top-1 right-24 !border-l-[10px] !border-l-transparent !border-r-[10px] !border-r-transparent !border-b-[10px] border-b-white"></div>
          {/* Menu */}
          <div className="rounded-3xl bg-white text-sm text-[#222] shadow-lg">
            <div className="w-[305px]">
              <div className="pt-5 px-6 pb-0">
                {user ? (
                  <div className="user-avatar flex flex-col items-center justify-center">
                    <Image
                      src={user.data.picture || "/assets/auth/default-user.jpg"}
                      alt={user.data.name!}
                      width={60}
                      height={60}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link href="/login">
                      <Button className="group/button relative items-center justify-center gap-x-1 whitespace-nowrap border border-orange-border transition-all duration-300 ease-bezier-1 select-none bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:bg-gradient-to-l text-white inline-block text-[14px] font-bold text-center cursor-pointer h-11 py-2 w-full rounded-md">
                        Sign in
                      </Button>
                    </Link>
                    <Link
                      href="/register"
                      className="h-10 text-sm hover:underline text-main-primary flex items-center justify-center cursor-pointer"
                    >
                      Register
                    </Link>
                  </div>
                )}
                {user && (
                  <>
                    <div className="w-full">
                      {role === "ADMIN" ? (
                        <Link
                          href={"/dashboard/admin"}
                          className="group/button relative items-center justify-center gap-x-1 whitespace-nowrap border border-orange-border transition-all duration-300 ease-bezier-1 select-none bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:bg-gradient-to-l text-white inline-block text-[14px] font-bold text-center cursor-pointer h-11 py-2 w-full rounded-md"
                        >
                          Switch to Admin Dashboard
                        </Link>
                      ) : role === "SELLER" ? (
                        <Link
                          href={"/dashboard/seller"}
                          className="group/button relative items-center justify-center gap-x-1 whitespace-nowrap border border-orange-border transition-all duration-300 ease-bezier-1 select-none bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:bg-gradient-to-l text-white inline-block text-[14px] font-bold text-center cursor-pointer h-11 py-2 w-full rounded-md"
                        >
                          Switch to Vendor Dashboard
                        </Link>
                      ) : role === "DRIVER" ? (
                        <Link
                          href={"/dashboard/driver"}
                          className="group/button relative items-center justify-center gap-x-1 whitespace-nowrap border border-orange-border transition-all duration-300 ease-bezier-1 select-none bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:bg-gradient-to-l text-white inline-block text-[14px] font-bold text-center cursor-pointer h-11 py-2 w-full rounded-md"
                        >
                          Switch to Rider Dashboard
                        </Link>
                      ) : (
                        <Link
                          href={"/dashboard/admin"}
                          className="group/button relative items-center justify-center gap-x-1 whitespace-nowrap border border-orange-border transition-all duration-300 ease-bezier-1 select-none bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:bg-gradient-to-l text-white inline-block text-[14px] font-bold text-center cursor-pointer h-11 py-2 w-full rounded-md"
                        >
                          Apply to become a Vendor
                        </Link>
                      )}
                    </div>
                    <p className="my-3 text-center text-sm text-main-primary cursor-pointer">
                      <a
                        onClick={logout}
                        className="block text-sm text-main-primary py-1.5 hover:underline"
                      >
                        Logout
                      </a>
                    </p>
                  </>
                )}

                <Separator />
              </div>
              {/* Links */}
              <div className="max-w-[calc(100vh-180px)] text-main-secondary overflow-y-auto overflow-x-hidden pt-0 px-2 pb-4">
                <ul className="grid grid-cols-3 gap-2 py-2.5 ^px-4 w-full">
                  {links.map((item) => (
                    <li key={item.title} className="grid place-items-center">
                      <Link href="#" className="space-y-2">
                        <div className="w-14 h-14 rounded-full p-2 grid place-items-center bg-gray-100 hover:bg-gray-200">
                          <span className="text-gray-500">{item.icon}</span>
                        </div>
                        <span className="block text-xs">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Separator className="!max-w-[257px] mx-auto" />
                <ul className="pt-2.5 pr-4 pb-1 pl-4 w-[288px]">
                  {extraLinks.map((item, i) => (
                    <li key={i}>
                      <Link
                        href="#"
                        className="block text-sm text-main-primary py-1.5 hover:underline"
                      >
                        {/* <a className="block text-sm text-main-primary py-1.5 hover:underline">
                        </a> */}
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const links = [
  {
    icon: <OrderIcon />,
    title: "My Orders",
    link: "/profile/orders",
  },
  {
    icon: <MessageIcon />,
    title: "Messages",
    link: "/profile/messages",
  },
  {
    icon: <WishlistIcon />,
    title: "WishList",
    link: "/profile/wishlist",
  },
];
const extraLinks = [
  {
    title: "Profile",
    link: "/profile",
  },
  {
    title: "Settings",
    link: "/",
  },
  {
    title: "Become a Seller",
    link: "/become-seller",
  },
  {
    title: "Help Center",
    link: "",
  },
  {
    title: "Return & Refund Policy",
    link: "/",
  },
  {
    title: "Legal & Privacy",
    link: "",
  },
  {
    title: "Discounts & Offers",
    link: "",
  },
  {
    title: "Order Dispute Resolution",
    link: "",
  },
  {
    title: "Report a Problem",
    link: "",
  },
];
