"use client";

// React
import { FC, useEffect } from "react";

// Prisma model
import { Chatbot } from "@/types/chatbot";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { ChatbotFormSchema } from "@/lib/schemas";

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
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../shared/image-upload";

// import { showToast } from "nextjs-toast-notify";
import toast from "react-hot-toast";

// Queries
import { upsertChatbot } from "@/queries/chatbot";

// Utils
import { useRouter } from "next/navigation";

interface ChatbotDetailsProps {
  data?: Chatbot;
}

const ChatbotDetails: FC<ChatbotDetailsProps> = ({ data }) => {
  // Initializing necessary hooks
  const router = useRouter(); // Hook for routing

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof ChatbotFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(ChatbotFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name,
      image: data?.image ? [{ url: data?.image }] : [],
    },
  });

  // console.log(form.control);
  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        image: [{ url: data?.image }],
      });
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof ChatbotFormSchema>) => {
    try {
      // Upserting category data
      const response = await upsertChatbot({
        id: data?.id,
        name: values.name,
        image: values.image[0].url,
      });

      // Displaying success message

      // toast.success({title: data?.id ? "Category has been updated." : `Congratulations! '${response?.name}' is now created.`, });
      toast.success(`Congratulations! '${response?.name}' is now created.`);
      // Redirect or Refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/chatbot");
      }
    } catch (error: any) {
      // Handling form submission errors
      console.log(error);

      toast.error(`Something went wrong.`);
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chatbot Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} chatbot information.`
              : " Lets create a chatbot. You can edit Details later from the Chat bot's table from the list of bots."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        value={field.value.map((image) => image.url)}
                        // disabled={isLoading}
                        onChange={(url) => field.onChange([{ url }])}
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url,
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                // disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.id
                    ? "Save category information"
                    : "Create category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ChatbotDetails;
