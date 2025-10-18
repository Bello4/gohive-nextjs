"use client";

import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";

//  model
import { Dispatch, DispatchStatus } from "@/types/dispatch";
import { User } from "@/types/user";

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

// Queries
import { updateDispatch } from "@/queries/dispatch";

// Validation schema
// const DispatchFormSchema = z.object({
//   status: z.enum([
//     "Pending",
//     "Accepted",
//     "InProgress",
//     "Completed",
//     "Cancelled",
//   ]),
// });

interface DispatchDetailsProps {
  data: Dispatch; // required now, since we’re only updating
  status: DispatchStatus;
  drivers: User[];
}

const DispatchDetails: FC<DispatchDetailsProps> = ({
  data,
  status,
  drivers,
}) => {
  // const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof DispatchFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(DispatchFormSchema),
    defaultValues: {
      status: status,
      driverId: data.driverId,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        status: status,
        driverId: data.driverId,
      });
    }
  }, [data, form]);

  const handleSubmit = async (values: z.infer<typeof DispatchFormSchema>) => {
    try {
      const response = await updateDispatch({
        id: data.id,
        status: values.status,
        driverId: values.driverId,
      });

      // toast({ title: `${response.name} has been updated.` });
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
      // toast({
      //   variant: "destructive",
      //   title: "Update failed",
      //   description: error.message || "Something went wrong.",
      // });
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

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Update {data.name} s profile information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Role */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <span>{field.value || "Select Status"}</span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Accepted">Accepted</SelectItem>
                          <SelectItem value="InProgress">InProgress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // disabled={isLoading}
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Driver</FormLabel>
                    <Select
                      disabled={isLoading || drivers.length == 0}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a Driver"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

export default DispatchDetails;
