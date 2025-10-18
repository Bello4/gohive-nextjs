// React, Next.js
import { FC } from "react";

// Clerk
// import { currentUser } from "@clerk/nextjs/server";

// Custom Ui Components
import Logo from "@/components/shared/logo";
// import UserInfo from "./user-info";
import { AdminSidebar } from "./nav-admin";
import { SellerSidebar } from "./nav-seller";
import { RiderSidebar } from "./nav-driver";

// Prisma models
import { Store } from "@/types/store";
import StoreSwitcher from "./store-switcher";

interface SidebarProps {
  isAdmin?: boolean;
  stores?: Store[];
  isDriver?: boolean;
}

const Sidebar: FC<SidebarProps> = ({ isAdmin, isDriver, stores }) => {
  // const user = await currentUser();
  return (
    <>
      {/* <Logo width="100%" height="100px" /> */}
      <span className="mt-3" />
      {/* {user && <UserInfo user={user} />} */}
      {isAdmin ? (
        <AdminSidebar variant="inset" />
      ) : isDriver ? ( // 👈 check driver
        <RiderSidebar variant="inset" />
      ) : (
        <SellerSidebar stores={stores} variant="inset" />
      )}
      {/* {!isAdmin && !isDriver && stores && <StoreSwitcher stores={stores} />} */}
    </>
  );
};

export default Sidebar;
