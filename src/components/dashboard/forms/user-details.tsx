"use client";

import { FC, useEffect } from "react";
import { useRouter } from "next/navigation";

//  model
import { User } from "@/types/user";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserFormSchema } from "@/lib/schemas";
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
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useToast } from "@/components/ui/use-toast";
import { showToast } from "nextjs-toast-notify";

// Queries
// import { updateUser } from "@/queries/people";
import { updateUser } from "@/lib/updates";

interface UserDetailsProps {
  data: User; // required now, since we’re only updating
}

const UserDetails: FC<UserDetailsProps> = ({ data }) => {
  // const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof UserFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      role: data?.role,
      status: data?.status,
    },
  });

  console.log(data);
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        status: data.status,
      });
    }
  }, [data, form]);

  const handleSubmit = async (values: z.infer<typeof UserFormSchema>) => {
    try {
      const response = await updateUser({
        id: data.id, // id from props/data
        name: values.name,
        email: values.email,
        role: values.role,
        status: values.status,
      });

      showToast.success("User has been updated", {
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

      showToast.error(
        error.response?.data?.message || "Something went wrong.",
        {
          duration: 3000,
          progress: false,
          position: "bottom-right",
          transition: "fadeIn",
          icon: "",
          sound: false,
        }
      );
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
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                {/* Role */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <span>{field.value || "Select role"}</span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="DRIVER">Driver</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="SELLER">Seller</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
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
                        >
                          <SelectTrigger>
                            <span>{field.value || "Select Status"}</span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                            <SelectItem value="INACTIVE">ACTIVE</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Update User"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default UserDetails;
