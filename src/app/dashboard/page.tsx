"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import Loading from "@/components/shared/loading";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth({ middleware: "auth" });

  useEffect(() => {
    if (!user?.data.role || user?.data.role === "USER") {
      router.push("/");
    } else if (user.data.role === "ADMIN") {
      router.push("/dashboard/admin");
    } else if (user.data.role === "SELLER") {
      router.push("/dashboard/seller");
    } else if (user.data.role === "DRIVER") {
      router.push("/dashboard/driver");
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Loading />
    </div>
  );
}
