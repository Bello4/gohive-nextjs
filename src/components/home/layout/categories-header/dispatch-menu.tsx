import Image from "next/image";
import SendPackage from "../../../../../public/assets/icons/send-package.webp";
import RecievePackage from "../../../../../public/assets/icons/recive-package.webp";
import OrderNowImage from "../../../../../public/assets/images/swiper/order-now.webp";
import Link from "next/link";

export default function DispatchMenu() {
  return (
    // <div className="p-1 grid grid-cols-2 gap-2 my-2">
    //   <Link href={"/logistic/send"}>
    //     <div className="relative overflow-hidden bg-slate-400 rounded-lg max-w-xs shadow-lg">
    //       <svg
    //         className="absolute bottom-0 left-0 mb-10"
    //         viewBox="0 0 375 283"
    //         fill="none"
    //         style={{ transform: "scale(1.5)", opacity: 0.1 }}
    //       >
    //         <rect
    //           x="159.52"
    //           y="175"
    //           width="152"
    //           height="152"
    //           rx="8"
    //           transform="rotate(-45 159.52 175)"
    //           fill="white"
    //         />
    //         <rect
    //           y="107.48"
    //           width="152"
    //           height="152"
    //           rx="8"
    //           transform="rotate(-45 0 107.48)"
    //           fill="white"
    //         />
    //       </svg>
    //       <div className="relative pt-9 px-9 flex items-center justify-center">
    //         <div
    //           className="block absolute w-30 h-30 bottom-0 left-0 -mb-24 ml-3"
    //           style={{
    //             background: "radial-gradient(black, transparent 60%)",
    //             transform: "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
    //             opacity: 0.2,
    //           }}
    //         ></div>

    //         {/* image */}
    //         <Image src={SendPackage} alt="RecievePackage" />
    //       </div>
    //       <div className="relative text-white px-3 ">
    //         <div className="flex justify-between">
    //           <span className="block font-semibold text-xl">
    //             Send a Package
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //   </Link>

    //   <Link href={"/logistic/recieve"}>
    //     <div className="relative overflow-hidden bg-slate-400 rounded-lg max-w-xs max-h-xs  shadow-lg">
    //       <svg
    //         className="absolute bottom-0 left-0 mb-10"
    //         viewBox="0 0 375 283"
    //         fill="none"
    //         style={{ transform: "scale(1.5)", opacity: 0.1 }}
    //       >
    //         <rect
    //           x="159.52"
    //           y="175"
    //           width="152"
    //           height="152"
    //           rx="8"
    //           transform="rotate(-45 159.52 175)"
    //           fill="white"
    //         />
    //         <rect
    //           y="107.48"
    //           width="152"
    //           height="152"
    //           rx="8"
    //           transform="rotate(-45 0 107.48)"
    //           fill="white"
    //         />
    //       </svg>
    //       <div className="relative pt-9 px-9 flex items-center justify-center">
    //         <div
    //           className="block absolute w-30 h-30 bottom-0 left-0 -mb-24 ml-3"
    //           style={{
    //             background: "radial-gradient(black, transparent 60%)",
    //             transform: "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
    //             opacity: 0.2,
    //           }}
    //         ></div>

    //         {/* image */}
    //         <Image src={RecievePackage} alt="RecievePackage" />
    //       </div>
    //       <div className="relative text-white px-3 ">
    //         <div className="flex justify-between">
    //           <span className="block font-semibold text-xl">
    //             Recieve Package
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //   </Link>
    // </div>
    <div className="relative cursor-pointer rounded-md overflow-hidden w-full h-48 group">
      {/* Background Image */}
      <Image
        src={OrderNowImage}
        alt="Order Now"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        placeholder="blur"
      />

      {/* Animated Button */}
      <Link
        href={"logistic/recieve"}
        className="absolute bottom-4 shadow-sm shadow-orange-400 right-4 bg-white text-black px-4 py-2 rounded-full font-semibold shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-black hover:text-white hover:shadow-xl group-hover:translate-y-0 translate-y-2  group-hover:opacity-100"
      >
        Order Rider →
      </Link>
    </div>
  );
}
