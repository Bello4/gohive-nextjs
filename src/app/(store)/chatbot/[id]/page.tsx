"use client";
import React from "react";
import { useAuth } from "@/hooks/auth";
// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Header from "@/components/home/layout/header/header";
import {
  getChatbotSession,
  createChatbotMessage,
  createChatbotSession,
  getChatbot,
} from "@/queries/chatbot";
import { Message } from "@/types/chatbot";
import Messages from "@/components/chatbotui/Messages";
import { useEffect, useState } from "react";
import { Chatbot } from "@/types/chatbot";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Schema
import { ChatbotMeassageFormSchema } from "@/lib/schemas";

function ChatbotPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = React.use(params);

  const { user } = useAuth();
  const [botData, setBotData] = useState(null);
  const [chatbotSession, setChatbotSession] = useState<Chatbot>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Don't proceed without user
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch chatbot data
        const data = await getChatbot(id);
        if (!data) {
          // Handle case where chatbot doesn't exist
          setLoading(false);
          return;
        }
        setBotData(data);

        // 2. Create chatbot session (only if we have both user and chatbot)
        const createdData = await createChatbotSession({
          userid: user?.data?.id, // Changed from user.data.id to user.id
          chatbotid: id,
        });

        setChatbotSession(createdData);

        await createChatbotMessage({
          chatsessionid: createdData.id,
          content: `Welcome to HiveGo ${data.name} agent ${user.data.name}\n How can i assist you today?`,
          sender: "ai",
        });

        // 3. Optionally fetch messages for this session
        if (createdData?.id) {
          const sessionMessages = await getChatbotSession(createdData.id);
          setMessages(sessionMessages.messages);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]); // This runs when id or user changes

  console.log("botsession-->", messages);

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof ChatbotMeassageFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(ChatbotMeassageFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      message: "",
    },
  });

  if (loading) return <OrderDetailsSkeleton />;
  if (!user) return <div>Please log in to access the chatbot</div>;
  if (!botData) return <div>Chatbot not found</div>;

  async function onSubmit(values: z.infer<typeof ChatbotMeassageFormSchema>) {
    // setLoading(true);
    const { message: formMessage } = values;

    const message = formMessage;
    form.reset();

    if (!user?.data?.name) {
      return;
    }

    if (!message.trim()) {
      return;
    }

    //    optimistic message
    const userMessage: Message = {
      id: Date.now(),
      content: message,
      created_at: new Date().toDateString(),
      chatsessionid: id,
      sender: "user",
    };

    // and show load state for AI responce
    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: "Agent HiveGo...",
      created_at: new Date().toISOString(),
      chatsessionid: id,
      sender: "ai",
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      loadingMessage,
    ]);

    try {
      // const result = await createChatbotMessage({
      //   userid: user.data.id, // Changed from user.data.id to user.id
      //   name: user.data.name,
      //   chatbotid: id,
      //   content: messages,
      //   chatbotSessionid: chatbotSession?.id,
      // });

      const token = localStorage.getItem("access_token");

      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Pass the token to the API route
          // ...(token && { "X-Auth-Token": token }),
        },
        body: JSON.stringify({
          name: user?.data?.name,
          chatsessionid: chatbotSession?.id,
          chatbotid: id,
          content: message,
          // Or pass token in the body
          token: token,
        }),
      });

      const result = await response.json();

      //  update the loading message for the AI
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: result.content, id: result.id }
            : msg,
        ),
      );
    } catch (error) {
      console.log("Error sending message", error);
    }
  }

  return (
    <div className="min-h-screen ">
      <Header />
      <Messages messages={messages} />

      <div className="h-dvh">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start fixed inset-x-0  bottom-0 z-50 space-x-4 drop-shadow-lg p-4 bg-gray-100 rounded-full m-3"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel hidden>Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type a message..."
                      {...field}
                      className="p-6 rounded-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              type="submit"
              className="h-full p-3 rounded-full"
            >
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

function OrderDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatbotPage;
