import CartContainer from "@/components/home/cart-page/container";
import Header from "@/components/home/layout/header/header";
import { Country } from "@/types/country";
import { cookies } from "next/headers";

export default function CartPage() {
  // Get cookies from the store
  const cookieStore = cookies();
  const userCountryCookie = cookieStore.get("userCountry");

  // Set default country if cookie is missing
  let userCountry: Country = {
    name: "Nigeria",
    city: "",
    code: "NG",
    region: "",
  };

  // If cookie exists, update the user country
  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value) as Country;
  }
  return (
    <>
      <Header />
      <CartContainer userCountry={userCountry} />
    </>
  );
}
