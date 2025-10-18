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
  Pending = "Pending",
  Accepted = "Accepted",
  InProgress = "InProgress",
  Completed = "Completed",
  Cancelled = "Cancelled",
}
