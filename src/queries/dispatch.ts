import axios from "@/lib/axios";
import { OrderData } from "@/app/(store)/logistic/recieve/page";
// Get all Categories
export async function getAllDispatchs() {
  const response = await axios.get("/api/v1/dispatchs");
  return response.data.dispatchs; // 👈 plural
}

export interface UpdateDispatchPayload {
  id: number;
  status: string; // This will be the API status like "driver_assigned", "in_transit", etc.
  driverId?: number;
  code?: string;
}

export async function updateDispatch(
  payload: UpdateDispatchPayload
): Promise<any> {
  const response = await axios.put(`/api/v1/dispatch-rides/${payload.id}`, {
    status: payload.status,
    driver_id: payload.driverId, // Make sure this matches your backend validation
  });
  return response.data;
}

export async function updateDriverDispatch(
  payload: UpdateDispatchPayload
): Promise<any> {
  const response = await axios.put(
    `/api/v1/driver/dispatch-rides/${payload.id}`,
    {
      status: payload.status,
      code: payload.code, // Make sure this matches your backend validation
    }
  );
  return response.data;
}

export interface DispatchRideResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    order_number: string;
    status: string;
    delivery_code: string;
    total_amount: number;
    pricing: {
      total_amount: number;
      delivery_fee: number;
      insurance_fee: number;
      service_charge: number;
    };
    locations: {
      pickup: {
        address: string;
        lat: number;
        lng: number;
      };
      dropoff: {
        address: string;
        lat: number;
        lng: number;
      };
    };
    parties: {
      sender: {
        name: string;
        phone: string;
        email: string;
      };
      receiver: {
        name: string;
        phone: string;
        email: string;
      };
    };
    package: {
      category: string;
      description?: string;
      value?: number;
    };
    timestamps: {
      created_at: string;
    };
  };
}

export interface CreateDispatchRidePayload {
  pickup_location: {
    address: string;
    lat: number;
    lng: number;
  };
  dropoff_location: {
    address: string;
    lat: number;
    lng: number;
  };
  sender_details: {
    name: string;
    phone: string;
    email: string;
  };
  receiver_details: {
    name: string;
    phone: string;
    email: string;
  };
  package_category: string;
  package_description: string;
  package_value: number | null;
  distance: number;
  duration: number;
  insurance_applied: boolean;
  payment_method: string;
  fragile_item: boolean;
  express_delivery: boolean;
  payment_reference?: string;
}

export async function createDispatchRide(
  orderData: OrderData & { paymentReference?: string }
): Promise<DispatchRideResponse> {
  const payload: CreateDispatchRidePayload = {
    pickup_location: {
      address: orderData.pickup.address,
      lat: orderData.pickup.lat,
      lng: orderData.pickup.lng,
    },
    dropoff_location: {
      address: orderData.dropoff.address,
      lat: orderData.dropoff.lat,
      lng: orderData.dropoff.lng,
    },
    sender_details: {
      name: orderData.sender.name,
      phone: orderData.sender.phone,
      email: orderData.sender.email,
    },
    receiver_details: {
      name: orderData.receiver.name,
      phone: orderData.receiver.phone,
      email: orderData.receiver.email || "",
    },
    package_category: orderData.package.category,
    package_description: orderData.package.description || "",
    package_value: orderData.package.value || null,
    distance: orderData.distance,
    duration: orderData.duration,
    insurance_applied: orderData.insurance,
    payment_method: orderData.paymentMethod,
    fragile_item: false,
    express_delivery: false,
  };

  // Add payment reference if available (for Paystack)
  if (orderData.paymentReference) {
    payload.payment_reference = orderData.paymentReference;
  }

  const response = await axios.post("/api/v1/dispatch-rides", payload);
  return response.data;
}

export async function getDispatchRides(params?: {
  status?: string;
  page?: number;
  per_page?: number;
}): Promise<{ data: DispatchRideResponse["data"][]; meta: any }> {
  const response = await axios.get("/api/v1/dispatch-rides", { params });
  return response.data;
}

export async function getDispatchRide(
  orderId: number
): Promise<DispatchRideResponse> {
  const response = await axios.get(`/api/v1/dispatch-rides/${orderId}`);
  return response.data;
}

export async function cancelDispatchRide(
  orderId: number,
  reason: string
): Promise<DispatchRideResponse> {
  const response = await axios.post(
    `/api/v1/dispatch-rides/${orderId}/cancel`,
    { reason }
  );
  return response.data;
}

export async function getDriverDispatchRides(params?: {
  status?: string;
  page?: number;
  per_page?: number;
}): Promise<{ data: DispatchRideResponse["data"][]; meta: any }> {
  const response = await axios.get("/api/v1/driver/dispatch-rides", { params });
  return response.data;
}

export async function updateDispatchRideStatus(
  orderId: number,
  status: string
): Promise<DispatchRideResponse> {
  const response = await axios.patch(
    `/api/v1/driver/dispatch-rides/${orderId}/status`,
    { status }
  );
  return response.data;
}
