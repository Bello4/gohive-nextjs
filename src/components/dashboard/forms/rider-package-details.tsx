"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//  model
import { DispatchStatus } from "@/types/dispatch";
import { OrderDetails } from "@/types/logistic";
import {
  Package,
  Shield,
  CreditCard,
  MapPin,
  Navigation,
  Users,
  Phone,
  Mail,
  Car,
  Clock,
} from "lucide-react";
// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DispatchFormSchema } from "@/lib/schemas";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useToast } from "@/components/ui/use-toast";
import { showToast } from "nextjs-toast-notify";

// Safe number formatting
const formatCurrency = (value: number): string => {
  return `₦${value.toLocaleString()}`;
};

const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

// Queries
import { updateDriverDispatch } from "@/queries/dispatch";

interface DispatchDetailsProps {
  data: OrderDetails;
  status: DispatchStatus;
}

const RiderDispatchDetails: FC<DispatchDetailsProps> = ({ data, status }) => {
  const router = useRouter();

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleSMS = (phone: string) => {
    window.open(`sms:${phone}`);
  };

  const [showCodeInput, setShowCodeInput] = useState(false);

  const form = useForm<z.infer<typeof DispatchFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(DispatchFormSchema),
    defaultValues: {
      status: status,
      code: " ",
    },
  });

  const watchStatus = form.watch("status");

  // Show/hide code input based on status
  useEffect(() => {
    setShowCodeInput(watchStatus === "delivered");
  }, [watchStatus]);

  const formatDistance = (value: number | undefined | null): string => {
    const numValue = value || 0;
    return `${numValue.toFixed(1)} km`;
  };

  const formatDuration = (value: number | undefined | null): string => {
    const numValue = value || 0;
    return `${numValue} min`;
  };

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        status: status,
        code: "",
      });
    }
  }, [data, status, form]);

  const handleSubmit = async (values: z.infer<typeof DispatchFormSchema>) => {
    try {
      // console.log(values.driverId);
      if (values.status === "delivered") {
        if (!values.code) {
          showToast.error("Delivery code is required for completed status!", {
            duration: 3000,
            progress: false,
            position: "bottom-right",
            transition: "fadeIn",
            icon: "",
            sound: false,
          });
          return;
        }

        // Then validate the code matches
        if (data.delivery_code !== values.code) {
          showToast.error("Invalid Code, please try again", {
            duration: 3000,
            progress: false,
            position: "bottom-right",
            transition: "fadeIn",
            icon: "",
            sound: false,
          });
          return;
        }
      }

      await updateDriverDispatch({
        id: data.id,
        status: values.status,
        code: values.code,
      });

      showToast.success("Dispatch has been updated", {
        duration: 3000,
        progress: false,
        position: "bottom-right",
        transition: "fadeIn",
        icon: "",
        sound: false,
      });
      router.refresh();
    } catch (error: any) {
      console.error(error);
      showToast.error(error.message, {
        duration: 3000,
        progress: false,
        position: "bottom-right",
        transition: "fadeIn",
        icon: "",
        sound: false,
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      searching_driver: "bg-blue-100 text-blue-800",
      driver_assigned: "bg-purple-100 text-purple-800",
      picked_up: "bg-orange-100 text-orange-800",
      in_transit: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      failed: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dispatch Information</CardTitle>
          <CardDescription>
            Update Order- {data.orderNumber} information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm font-semibold">
              Created{" "}
              {new Date(data.timestamps.created_at).toLocaleDateString()}
            </p>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                data.status.current
              )}`}
            >
              {data.status.readable}
            </div>
          </div>
          <div className=" rounded-lg shadow-sm p-6">
            <h2 className="text-md font-semibold  mb-4">Contact Details</h2>

            <div className="space-y-6">
              {/* Sender Details */}
              <div>
                <h3 className="font-medium  mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Sender Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className=" font-medium">{data.parties.sender.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="">{data.parties.sender.phone}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCall(data.parties.sender.phone)}
                        className="text-orange-500 hover:text-orange-600 p-1"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSMS(data.parties.sender.phone)}
                        className=" p-1"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="">{data.parties.sender.email}</p>
                </div>
              </div>

              {/* Receiver Details */}
              <div>
                <h3 className="font-medium  mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Receiver Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className=" font-medium">{data.parties.receiver.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="">{data.parties.receiver.phone}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCall(data.parties.receiver.phone)}
                        className="text-orange-500 hover:text-orange-600 p-1"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSMS(data.parties.receiver.phone)}
                        className=" p-1"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {data.parties.receiver.email && (
                    <p className="">{data.parties.receiver.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className=" rounded-lg shadow-sm p-6">
            <h2 className="text-md font-semibold  mb-4">Delivery Route</h2>

            {/* Map Placeholder - Replace with actual map implementation */}

            {/* Route Details */}
            <div className="space-y-3">
              {/* Pickup Location */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                  <MapPin className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium ">Pickup Location</p>
                  <p className="text-sm  truncate">
                    {data.locations.pickup.address || "Address not available"}
                  </p>
                </div>
              </div>

              {/* Distance & Time */}
              <div className="flex items-center justify-between text-sm px-2">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    {formatDuration(data.metrics.estimated_duration_minutes)}
                  </span>
                </div>
                <div className="">•</div>
                <div>
                  <span>{formatDistance(data.metrics.distance_km)}</span>
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                  <MapPin className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Dropoff Location</p>
                  <p className="text-sm truncate">
                    {data.locations.dropoff.address || "Address not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Driver Location (if assigned and in transit) */}
            {data.driver && data.status.current === "in_transit" && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Driver Location
                </p>
                <p className="text-sm text-blue-700">
                  {data.driver.name} is currently en route to dropoff location
                </p>
              </div>
            )}
          </div>
          <div className=" rounded-lg shadow-sm p-6">
            <h2 className="text-md font-semibold  mb-4">Order Summary</h2>

            <div className="space-y-4">
              {/* Package Details */}
              <div className="flex items-start space-x-3">
                <Package className="w-5 h-5 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium ">Package Details</p>
                  <div className="mt-1 text-sm  space-y-1">
                    <p>
                      Category:{" "}
                      <span className="capitalize">
                        {data.package.category}
                      </span>
                    </p>
                    {data.package.description && (
                      <p>Description: {data.package.description}</p>
                    )}
                    {data.package.fragile && (
                      <p className="text-orange-600">⚠️ Fragile Item</p>
                    )}
                    {data.package.express && (
                      <p className="text-blue-600">⚡ Express Delivery</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Insurance */}
              {data.insurance.applied && (
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium ">Insurance</p>
                    <p className="text-sm  mt-1">
                      Package insured for {formatCurrency(data.package.value)}
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5  mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium ">Payment</p>
                  <div className="mt-1 text-sm ">
                    <p className="capitalize">
                      {data.payment.method.replace("_", " ")}
                    </p>
                    <p
                      className={`text-xs ${
                        data.payment.status === "paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      ●{" "}
                      {data.payment.status.charAt(0).toUpperCase() +
                        data.payment.status.slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bdata-t pt-4 mt-4">
                <p className="font-medium  mb-3">Pricing Breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="">Base Fare</span>
                    <span className="">
                      {formatCurrency(data.pricing.base_fare)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">
                      Distance Fare ({formatNumber(data.metrics.distance_km)}{" "}
                      km)
                    </span>
                    <span className="">
                      {formatCurrency(data.pricing.distance_fare)}
                    </span>
                  </div>
                  {data.insurance.applied && (
                    <div className="flex justify-between">
                      <span className="">Insurance Fee</span>
                      <span className="">
                        {formatCurrency(data.pricing.insurance_fee)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="">Service Charge</span>
                    <span className="">
                      {formatCurrency(data.pricing.service_charge)}
                    </span>
                  </div>
                  <div className="bdata-t pt-2 flex justify-between font-semibold ">
                    <span>Total Amount</span>
                    <span className="text-orange-600">
                      {formatCurrency(data.pricing.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10" />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 "
            >
              {/* Status Field */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="package_picked_up">
                            Picked UP
                          </SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Conditionally render code input */}
              {showCodeInput && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Delivery Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter delivery code"
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Update Dispatch"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default RiderDispatchDetails;
