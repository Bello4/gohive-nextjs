"use client";

import { MessageIcon, OrderIcon, WishlistIcon } from "@/components/home/icons";
import { Button } from "@/components/home/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/auth";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, UserIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UserMenu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();
  const role = user?.data?.role;

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  console.log(role);

  return (
    <div className="relative" ref={modalRef}>
      {/* Trigger */}
      <div>
        {user ? (
          <button
            onClick={toggleModal}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image
              src={user.data?.picture || "/assets/auth/default-user.jpg"}
              alt={user.data?.name || "User"}
              width={40}
              height={40}
              className="w-10 h-10 object-cover rounded-full border-2 border-white hover:border-gray-300 transition-colors"
            />
            <ChevronDown className="w-4 h-4 text-white" />
          </button>
        ) : (
          <button
            onClick={toggleModal}
            className="flex h-11 items-center py-0 mx-2 cursor-pointer"
          >
            <span className="text-2xl">
              <UserIcon />
            </span>
            <div className="ml-1">
              <span className="block text-xs text-white leading-3">
                Welcome
              </span>
              <b className="font-bold text-xs text-white leading-4 flex items-center">
                <span>Sign in / Register</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </b>
            </div>
          </button>
        )}
      </div>

      {/* Modal Content */}
      {isModalOpen && (
        <div className="absolute top-full right-0 mt-2 z-50">
          {/* Triangle Indicator */}
          <div className="w-0 h-0 absolute -top-2 right-4 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>

          {/* Menu */}
          <div className="rounded-2xl bg-white text-sm text-[#222] shadow-xl border border-gray-200 min-w-[320px]">
            <div className="p-6 pb-2">
              {user ? (
                <div className="user-avatar flex flex-col items-center justify-center mb-2">
                  <Image
                    src={user.data?.picture || "/assets/auth/default-user.jpg"}
                    alt={user.data?.name || "User"}
                    width={40}
                    height={40}
                    className="w-16 h-16 object-cover rounded-full border-2 border-gray-200 mb-3"
                  />
                  <h3 className="font-semibold text-lg">{user.data?.name}</h3>
                  <p className="text-gray-600 text-sm">{user.data?.email}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={closeModal}>
                    <Button className="w-full bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white h-11 rounded-lg font-bold">
                      Sign in
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeModal}
                    className="h-10 text-sm hover:underline text-main-primary flex items-center justify-center cursor-pointer font-medium"
                  >
                    Create an account
                  </Link>
                </div>
              )}

              {user && (
                <>
                  <div className="w-full mb-2">
                    {role === "ADMIN" ? (
                      <>
                        <h3 className="font-semibold mb-2 text-center text-lg">
                          ₦{user.data?.balance}
                        </h3>
                        <Link
                          href="/dashboard/admin"
                          onClick={closeModal}
                          className="block w-full text-center bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white py-3 rounded-lg font-bold text-sm transition-all"
                        >
                          Admin Dashboard
                        </Link>
                      </>
                    ) : role === "SELLER" ? (
                      <>
                        <h3 className="font-semibold mb-2 text-center text-lg">
                          ₦{user.data?.balance}
                        </h3>
                        <Link
                          href="/dashboard/seller"
                          onClick={closeModal}
                          className="block w-full text-center bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white py-3 rounded-lg font-bold text-sm transition-all"
                        >
                          Vendor Dashboard
                        </Link>
                      </>
                    ) : role === "DRIVER" ? (
                      <>
                        <h3 className="font-semibold mb-2 text-center text-lg">
                          ₦{user.data?.balance}
                        </h3>

                        <Link
                          href="/dashboard/driver"
                          onClick={closeModal}
                          className="block w-full text-center bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white py-3 rounded-lg font-bold text-sm transition-all"
                        >
                          Rider Dashboard
                        </Link>
                      </>
                    ) : (
                      <>
                        {/* <Link
                          aria-disabled
                          href="/become-seller"
                          onClick={closeModal}
                          className="block w-full text-center bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] hover:from-[#ff7539] hover:to-[#ff0a0a] text-white py-3 rounded-lg font-bold text-sm transition-all"
                        >
                          Become a Vendor
                        </Link> */}

                        <h3 className="font-semibold text-center text-lg">
                          ₦{user.data?.balance}
                        </h3>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      closeModal();
                    }}
                    className="w-full text-center text-red-600 hover:text-red-700 py-2 hover:underline font-medium text-sm"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* <Separator /> */}

            {/* Quick Links */}
            <div className="p-2">
              {/* <ul className="grid grid-cols-3 gap-3 mb-3">
                {links.map((item) => (
                  <li key={item.title} className="grid place-items-center">
                    <Link
                      href={item.link}
                      onClick={closeModal}
                      className="space-y-2 group"
                    >
                      <div className="w-12 h-12 rounded-full p-2 grid place-items-center bg-gray-100 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                        <span className="text-gray-500 group-hover:text-orange-600 transition-colors">
                          {item.icon}
                        </span>
                      </div>
                      <span className="block text-xs font-medium text-center">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul> */}

              <Separator className="my-1" />

              <ul className="space-y-1">
                {extraLinks.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.link}
                      onClick={closeModal}
                      className="block text-sm text-gray-700 hover:text-orange-600 py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
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
    link: "/settings",
  },
  {
    title: "Become a Vendor",
    link: "/become-seller",
  },
  {
    title: "Return & Refund Policy",
    link: "/return-policy",
  },
  {
    title: "Legal & Privacy",
    link: "/legal",
  },
  {
    title: "Discounts & Offers",
    link: "/offers",
  },
  {
    title: "Order Dispute Resolution",
    link: "/dispute-resolution",
  },
  // {
  //   title: "Report a Problem",
  //   link: "/report-problem",
  // },
];
