import OrdersOverview from "@/components/home/profile/orders-overview";
import ProfileOverview from "@/components/home/profile/overview";
import { UsersCards } from "@/components/home/profile/analytic-overview";

export default function ProfilePage() {
  return (
    <div className="w-full p-4 space-y-4">
      <ProfileOverview />
      <OrdersOverview />
    </div>
  );
}
