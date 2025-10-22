import Image from "next/image";
import SendPackage from "../../../../../public/assets/icons/send-package.webp";
import RecievePackage from "../../../../../public/assets/icons/recive-package.webp";

export default function DispatchMenu() {
  return (
    <div className="p-1 grid grid-cols-2 gap-2 my-2">
      <div className="relative overflow-hidden bg-slate-400 rounded-lg max-w-xs shadow-lg">
        <svg
          className="absolute bottom-0 left-0 mb-10"
          viewBox="0 0 375 283"
          fill="none"
          style={{ transform: "scale(1.5)", opacity: 0.1 }}
        >
          <rect
            x="159.52"
            y="175"
            width="152"
            height="152"
            rx="8"
            transform="rotate(-45 159.52 175)"
            fill="white"
          />
          <rect
            y="107.48"
            width="152"
            height="152"
            rx="8"
            transform="rotate(-45 0 107.48)"
            fill="white"
          />
        </svg>
        <div className="relative pt-8 px-8 flex items-center justify-center">
          <div
            className="block absolute w-30 h-30 bottom-0 left-0 -mb-24 ml-3"
            style={{
              background: "radial-gradient(black, transparent 60%)",
              transform: "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
              opacity: 0.2,
            }}
          ></div>

          {/* image */}
          <Image src={SendPackage} alt="RecievePackage" />
        </div>
        <div className="relative text-white px-3 ">
          <div className="flex justify-between">
            <span className="block font-semibold text-xl">Send Package</span>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden bg-slate-400 rounded-lg max-w-xs max-h-xs  shadow-lg">
        <svg
          className="absolute bottom-0 left-0 mb-10"
          viewBox="0 0 375 283"
          fill="none"
          style={{ transform: "scale(1.5)", opacity: 0.1 }}
        >
          <rect
            x="159.52"
            y="175"
            width="152"
            height="152"
            rx="8"
            transform="rotate(-45 159.52 175)"
            fill="white"
          />
          <rect
            y="107.48"
            width="152"
            height="152"
            rx="8"
            transform="rotate(-45 0 107.48)"
            fill="white"
          />
        </svg>
        <div className="relative pt-10 px-10 flex items-center justify-center">
          <div
            className="block absolute w-30 h-30 bottom-0 left-0 -mb-24 ml-3"
            style={{
              background: "radial-gradient(black, transparent 60%)",
              transform: "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
              opacity: 0.2,
            }}
          ></div>

          {/* image */}
          <Image src={RecievePackage} alt="RecievePackage" />
        </div>
        <div className="relative text-white px-3 ">
          <div className="flex justify-between">
            <span className="block font-semibold text-xl">Recieve Package</span>
          </div>
        </div>
      </div>
    </div>
  );
}
