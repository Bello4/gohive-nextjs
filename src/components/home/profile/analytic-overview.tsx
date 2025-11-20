"use client";
// import { currentUser } from "@clerk/nextjs/server";
import { useAuth } from "@/hooks/auth";
import { Eye, Heart, Puzzle, Rss, WalletCards } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UsersCards() {
  const { user } = useAuth();
  // const user = await currentUser();
  if (!user) return;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
        </CardHeader>
      </Card>
      {menu.map((item) => (
        <Card key={item.link} className="@container/card">
          <CardHeader>
            <CardDescription>{item.title}</CardDescription>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 ">
            <div className=" flex flex-wrap ">
              <Link
                href={item.link}
                className=" relative flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="text-3xl">
                  <span>{item.icon}</span>
                </div>
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}

      {/* <div className="w-full bg-red-500">
        <div className="bg-white p-4 border shadow-sm">
          <div className="mt-4 flex flex-wrap py-4">
            {menu.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className="w-36 relative flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="text-3xl">
                  <span>{item.icon}</span>
                </div>
                <div className="mt-2">{item.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}

const menu = [
  {
    title: "Wishlist",
    icon: <Heart />,
    link: "/profile/wishlist",
  },
  {
    title: "Following",
    icon: <Rss />,
    link: "/profile/following/1",
  },
  {
    title: "Viewed",
    icon: <Eye />,
    link: "/profile/history/1",
  },
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
