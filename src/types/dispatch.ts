export interface Dispatch {
  id: number;
  name: string;
  weight: string;
  pickUpAt: string;
  dropAt: string;
  discount: number;
  code: number;
  cost: number;
  type: string;
  distance: number;
  recieverName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  createdById: string;
  driverId: number;
  status: string;
}

export enum DispatchStatus {
  PENDING = "pending",
  SEARCHING_DRIVER = "searching_driver",
  DRIVER_ASSIGNED = "driver_assigned",
  PICKED_UP = "package_picked_up",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  FAILED = "failed",
}

// API Status - what comes from your backend
export enum ApiDispatchStatus {
  PENDING = "pending",
  SEARCHING_DRIVER = "searching_driver",
  DRIVER_ASSIGNED = "driver_assigned",
  PICKED_UP = "picked_up",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  FAILED = "failed",
}

// Form Status - what you use in your form/dropdown
export enum FormDispatchStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  IN_PROGRESS = "InProgress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

// Union type for TypeScript
export type ApiStatus = `${ApiDispatchStatus}`;
export type FormStatus = `${FormDispatchStatus}`;
