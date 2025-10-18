import Link from "next/link";
import UserMenu from "./user-menu/user-menu";
import Cart from "./cart";
import DownloadApp from "./download-app";
import Logo from "@/components/shared/logo";

// import Search from "./search/search";

export default function Header() {
  return (
    <div className="sticky top-0 bg-white shadow z-50 bg-gradient-to-r from-slate-500 to-slate-800">
      <div className="h-full w-full lg:flex text-white px-4 lg:px-12">
        <div className="flex lg:w-full lg:flex-1 flex-col lg:flex-row gap-3 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="font-extrabold text-3xl font-mono">HiveGo</h1>
              {/* <Logo className="pr-3" width="50%" height="20px" /> */}
            </Link>
            <div className="flex lg:hidden">
              <UserMenu />
              <Cart />
            </div>
          </div>
          {/* <Search /> */}
        </div>
        <div className="hidden lg:flex w-full lg:w-fit lg:mt-2 justify-end mt-1.5 pl-6">
          <div className="lg:flex">
            <DownloadApp />
          </div>
          {/* <CountryLanguageCurrencySelector userCountry={userCountry} /> */}
          <UserMenu />
          <Cart />
        </div>
      </div>
    </div>
  );
}
