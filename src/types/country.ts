import { ShippingRate } from "./shippingrates";
import { User } from "./user";

export interface Country {
  id: number;
  name: string;
  code: string;
  city: string;
  region: string;
}

export type CountryWithShippingRatesType = {
  countryId: string;
  countryName: string;
  shippingRate: ShippingRate;
};

export type SelectMenuOption = {
  name: string;
  code: string;
};

export type UserShippingAddressType = {
  default: boolean;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  state: string;
  phone: string;
  userId: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  zip_code: string;
  countryId: string;
  country: Country;
  user: User;
};
