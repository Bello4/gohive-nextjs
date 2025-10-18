export interface User {
  id: number;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  phone: string;
  picture: string;
  email: string;
  role: "ADMIN" | "SELLER" | "DRIVER" | "USER";
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
