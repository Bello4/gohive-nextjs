import Link from "next/link";
import UserMenu from "./user-menu/user-menu";
import Cart from "./cart";
import DownloadApp from "./download-app";
import Logo from "@/components/shared/logo";

// import Search from "./search/search";

export default function Header() {
  return (
    <div className=" sticky top-0 bg-white shadow z-50 bg-gradient-to-r from-slate-500 to-slate-800 py-2">
      <div className="h-full w-full lg:flex text-white px-1 lg:px-12">
        <div className="flex lg:w-full lg:flex-1 flex-col lg:flex-row gap-3 py-3">
          <div className="flex items-center justify-between px-4">
            <Link href="/">
              {/* <h1 className="font-extrabold text-3xl font-mono">HiveGo</h1> */}
              <Logo width="50%" height="20px" />
            </Link>
            <div className="flex lg:hidden">
              <Cart />
              <UserMenu />
            </div>
          </div>
          {/* <Search /> */}
        </div>
        <div className="hidden lg:flex w-full lg:w-fit lg:mt-2 justify-end mt-1.5 pl-3">
          {/* <div className="lg:flex">
            <DownloadApp />
          </div> */}
          {/* <CountryLanguageCurrencySelector userCountry={userCountry} /> */}
          <Cart />
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
