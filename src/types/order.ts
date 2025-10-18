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
