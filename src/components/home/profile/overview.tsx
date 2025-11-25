"use client";
// import { currentUser } from "@clerk/nextjs/server";
import { useAuth } from "@/hooks/auth";
import { Eye, Heart, Puzzle, Rss, WalletCards, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfileOverview() {
  const { user } = useAuth();
  // const user = await currentUser();
  if (!user) return;
  return (
    <div className="w-full bg-red-500">
      <div className="bg-white p-4 border shadow-sm">
        {/* <div className="flex items-center">
          <Image
            src={user.data?.picture || "/assets/auth/default-user.jpg"}
            alt={user.fullName!}
            width={200}
            height={200}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="flex-1 ml-4 text-main-primary text-xl font-bold capitalize ">
            {user.fullName?.toLowerCase()}
          </div>
        </div> */}
        <Card className="@container/card bg-gray-200">
          <CardHeader>
            <CardDescription>Balance</CardDescription>
            <CardTitle className="text-xl  font-semibold tabular-nums @[250px]/card:text-2xl">
              ₦{user?.data.balance}
            </CardTitle>
          </CardHeader>
        </Card>
        <div className="mt-1 flex flex-wrap items-center justify-center py-1">
          {menu.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              className="w-30 relative flex flex-col mt-3 items-center justify-center cursor-pointer"
            >
              <div className="text-2xl">
                <span>{item.icon}</span>
              </div>
              <div className="mt-1">{item.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const menu = [
  {
    title: "Fund Wallet",
    icon: <Wallet />,
    link: "/profile/wallet",
  },
  {
    title: "Wishlist",
    icon: <Heart />,
    link: "/profile/wishlist",
  },
  // {
  //   title: "Following",
  //   icon: <Rss />,
  //   link: "/profile/following/1",
  // },
  // {
  //   title: "Viewed",
  //   icon: <Eye />,
  //   link: "/profile/history/1",
  // },
  {
    title: "Coupons",
    icon: <Puzzle />,
    link: "/profile/coupons",
  },
  {
    title: "Shopping credit",
    icon: <WalletCards />,
    link: "/profile/credit",
  },
];
