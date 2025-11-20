import AddressContainer from "@/components/home/profile/addresses/container";
import { db } from "@/lib/db";
import { getUserShippingAddresses } from "@/queries/user";

export default async function ProfileAddressesPage() {
  const addresses = await getUserShippingAddresses();
  const countries = await db.country.findMany();
  return (
    <div>
      <AddressContainer addresses={addresses} countries={countries} />
    </div>
  );
}
