"use client";
import { useAuth } from "@/hooks/auth";
import AddressContainer from "@/components/home/profile/addresses/container";
import { getAllCountries } from "@/queries/country";

export default function ProfileAddressesPage() {
  const { user } = useAuth();

  const addresses = user?.data?.address;
  const countries = getAllCountries();
  return (
    <div>
      <AddressContainer addresses={addresses} countries={countries} />
    </div>
  );
}
