import { ShippingRate } from "./shippingrates";

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
