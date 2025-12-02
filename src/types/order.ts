export enum OrderStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Processing = "Processing",
  Shipped = "Shipped",
  OutforDelivery = "OutforDelivery",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Failed = "Failed",
  Refunded = "Refunded",
  Returned = "Returned",
  PartiallyShipped = "PartiallyShipped",
  OnHold = "OnHold",
}

export type OrderFulltType = {
  shippingAddress: {
    user: {
      name: string;
      id: string;
      email: string;
      picture: string;
      type: string | null;
      address: string | null;
      state: string | null;
      country: string | null;
      passport: string | null;
      phone: string | null;
      nin: string | null;
      password: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  };
};

export type OrderTableFilter =
  | ""
  | "unpaid"
  | "toShip"
  | "shipped"
  | "delivered";

export type StoreOrderType = {
  id: number;
  coupon?: {
    id: number;
    code: string;
    discount: number;
  };
  items: {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
  }[];
  order: {
    payment_status: string;
    shipping_address: {
      id: number;
      address: string;
      country: { id: number; name: string };
      user: { id: number; email: string };
    };
    payment_details: {
      id: number;
      method: string;
      amount: number;
    }[];
  };
  updated_at: string;
};
