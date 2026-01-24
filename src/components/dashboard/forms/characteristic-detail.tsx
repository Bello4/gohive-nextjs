"use client";

// React
import { FC, useEffect } from "react";

// Prisma model
import { ChatbotCharacteristic } from "@/types/chatbot";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { CharacteristicFormSchema } from "@/lib/schemas";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// import { showToast } from "nextjs-toast-notify";
import toast from "react-hot-toast";

// Queries
import { upsertChatbotCharacter } from "@/queries/chatbot";

// Utils
import { useRouter } from "next/navigation";

interface ChatbotDetailsProps {
  data?: ChatbotCharacteristic;
  chatbotId?: number;
}

const CharacteristicDetails: FC<ChatbotDetailsProps> = ({
  data,
  chatbotId,
}) => {
  // Initializing necessary hooks
  const router = useRouter(); // Hook for routing

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof CharacteristicFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(CharacteristicFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      content: data?.content,
      chatbotId: chatbotId,
    },
  });

  // console.log(form.control);
  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        content: data?.content,
        chatbotId: chatbotId,
      });
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (
    values: z.infer<typeof CharacteristicFormSchema>,
  ) => {
    try {
      // Upserting category data
      // console.log("the chat id", chatbotId);
      if (!chatbotId) {
        toast.error("Chatbot ID is required");
        return;
      }
      await upsertChatbotCharacter({
        id: data?.id,
        content: values.content,
        chatbotId: chatbotId,
      });

      // Displaying success message

      // toast.success({title: data?.id ? "Category has been updated." : `Congratulations! '${response?.name}' is now created.`, });
      toast.success(`A chat bot Character is now created.`);
      // Redirect or Refresh data
      router.refresh();
    } catch (error: any) {
      // Handling form submission errors
      console.log(error);

      toast.error(`Something went wrong.`);
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* <input type="hidden" {...form.register("chatbotId")} /> */}
              <FormField
                // disabled={isLoading}
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="Example: if customers ask for price, provide pricing page link"
                        {...field}
                      />
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
                    : "Create Bot Character"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CharacteristicDetails;
