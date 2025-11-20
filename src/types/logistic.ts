export interface OrderDetails {
  id: number;
  orderNumber: string;
  orderType: string;
  scheduled_for: string | null;

  // Locations
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

  // Metrics
  metrics: {
    distance_km: number;
    estimated_duration_minutes: number;
  };

  // Parties
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

  delivery_code: string;

  // Package
  package: {
    category: string;
    description: string;
    value: number;
    fragile: boolean;
    express: boolean;
  };

  // Pricing - Nested under pricing
  pricing: {
    base_fare: number;
    distance_fare: number;
    service_charge: number;
    insurance_fee: number;
    express_fee: number;
    total_amount: number;
  };

  // Insurance
  insurance: {
    applied: boolean;
    fee: number;
  };

  // Payment
  payment: {
    method: string;
    status: string;
  };

  // Status - Nested under status
  status: {
    current: string;
    readable: string;
    tracking_timeline: Array<{
      status: string;
      title: string;
      description: string;
      timestamp: string;
      completed: boolean;
    }>;
  };

  // Driver
  driver: {
    id: number;
    name: string;
    email: string;
    phone: string;
    vehicle_type: string;
    vehicle_number: string;
    rating: number;
  };

  // User
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };

  // Timestamps
  timestamps: {
    created_at: string;
    driver_assigned_at: string | null;
    picked_up_at: string | null;
    delivered_at: string | null;
    cancelled_at: string | null;
  };

  // Actions
  actions: {
    can_cancel: boolean;
    can_track: boolean;
  };
}

export interface AdminOrderDetails {
  id: number;
  orderNumber: string;
  orderType: string;
  scheduled_for: string | null;

  // Locations
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

  // Metrics
  metrics: {
    distance_km: number;
    estimated_duration_minutes: number;
  };

  // Parties
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

  delivery_code: string;

  // Package
  package: {
    category: string;
    description: string;
    value: number;
    fragile: boolean;
    express: boolean;
  };

  // Pricing - Nested under pricing
  pricing: {
    base_fare: number;
    distance_fare: number;
    service_charge: number;
    insurance_fee: number;
    express_fee: number;
    total_amount: number;
  };

  // Insurance
  insurance: {
    applied: boolean;
    fee: number;
  };

  // Payment
  payment: {
    method: string;
    status: string;
  };

  // Status - Nested under status
  status: {
    current: string;
    readable: string;
    tracking_timeline: Array<{
      status: string;
      title: string;
      description: string;
      timestamp: string;
      completed: boolean;
    }>;
  };

  // Driver
  driver?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };

  // User
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };

  // Timestamps
  timestamps: {
    created_at: string;
    driver_assigned_at: string | null;
    picked_up_at: string | null;
    delivered_at: string | null;
    cancelled_at: string | null;
  };

  // Actions
  actions: {
    can_cancel: boolean;
    can_track: boolean;
  };
}

export enum DispatchStatus {
  PENDING = "pending",
  SEARCHING_DRIVER = "searching_driver",
  DRIVER_ASSIGNED = "driver_assigned",
  PICKED_UP = "picked_up",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  FAILED = "failed",
}
export interface OrderStatusTimeline {
  status: string;
  title: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}
