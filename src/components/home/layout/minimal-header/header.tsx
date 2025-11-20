"use client";

import { useAuth } from "@/hooks/auth";
import UserMenu from "../header/user-menu/user-menu";
import { ChevronDown, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";

export default function MinimalHeader() {
  const { user } = useAuth();
  return (
    <div className="bg-transparent h-16 w-full border-b">
      <div className="mx-auto px-6">
        <div className="relative flex items-center justify-between py-2">
          <Link href="/">
            <h1 className="font-extrabold text-2xl font-mono">HiveGo</h1>
          </Link>
          <div className="flex items-center gap-x-5">
            <div className="flex items-center gap-x-1">
              <Globe className="w-3" />
              <div className="text-sm text-main-primary py-2 cursor-pointer">
                English
              </div>
              <ChevronDown className="w-3" />
            </div>
            {user ? (
              <UserMenu />
            ) : (
              <Link href="/sign-in">
                <Button variant="outline">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
