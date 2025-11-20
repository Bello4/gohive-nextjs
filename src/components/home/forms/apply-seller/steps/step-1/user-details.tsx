"use client";

import { useAuth } from "@/hooks/auth";

import Input from "@/components/home/ui/input";
import Image from "next/image";
import { useRef } from "react";

export default function UserDetails() {
  const { user } = useAuth();

  const btnConatinerRef = useRef<HTMLDivElement | null>(null);

  const handleImageClick = () => {
    const userButton = btnConatinerRef.current?.querySelector("button");
    if (userButton) {
      userButton.click();
    }
  };
  return (
    <div className="w-full flex flex-col gap-y-4 justify-center items-center">
      <div className="relative">
        {/* User Image */}
        <Image
          src={user.data?.picture || "/assets/auth/default-user.jpg"}
          alt="User avatar"
          width={200}
          height={200}
          className="rounded-full cursor-pointer"
          onClick={handleImageClick}
        />
        {/* Hidden UserButton */}
        <div
          ref={btnConatinerRef}
          className="absolute inset-0 z-0 opacity-0 pointer-events-none"
        >
          {/*  */}
        </div>
      </div>
      {/* First Name Input */}
      <Input
        name="firstName"
        value={user?.data.name || ""}
        onChange={() => {}}
        type="text"
        readonly
      />
    </div>
  );
}
