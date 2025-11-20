"use client";
// React, Next.js
import { FC } from "react";
import Image from "next/image";

import { usePathname } from "next/navigation";
// Logo image
import LogoImg from "../../../public/assets/icons/logo-small.png";
import LogoWhite from "../../../public/assets/icons/dashboard.png";

interface LogoProps {
  width: string;
  height: string;
}

const Logo: FC<LogoProps> = ({ width, height }) => {
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard");
  return (
    <div className=" z-50" style={{ width: width, height: height }}>
      <Image
        src={isDashboard ? LogoImg : LogoWhite}
        alt="GoHive"
        className="w-full h-full object-cover overflow-visible"
      />
    </div>
  );
};

export default Logo;
