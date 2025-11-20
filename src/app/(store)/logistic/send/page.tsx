"use client";

import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import Header from "@/components/home/layout/header/header";

export default function Send() {
  const router = useRouter();
  const { user } = useAuth({ middleware: "auth" });

  if (!user) {
    router.push("/login");
  }

  return (
    <>
      <Header />
    </>
  );
}
