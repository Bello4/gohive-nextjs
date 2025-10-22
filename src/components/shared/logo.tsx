// React, Next.js
import { FC } from "react";
import Image from "next/image";

// Logo image
import LogoImg from "../../../public/assets/icons/logo-small.png";
import LogoWhite from "../../../public/assets/icons/dashboard.png";

interface LogoProps {
  width: string;
  height: string;
}

const Logo: FC<LogoProps> = ({ width, height }) => {
  return (
    <div className="pl-6 z-50" style={{ width: width, height: height }}>
      <Image
        src={LogoWhite}
        alt="GoHive"
        className="w-full h-full object-cover overflow-visible"
      />
    </div>
  );
};

export default Logo;
