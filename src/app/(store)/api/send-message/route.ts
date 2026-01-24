import Axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {
  getChatbotSession,
  createChatbotMessage,
  getChatbot,
} from "@/queries/chatbot";

// Validate API key exists
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function POST(req: NextRequest) {
  const { chatsessionid, chatbotid, content, name, token } = await req.json();

  console.log(
    `Recieved message from chat session ${chatsessionid}: ${content} (chatbot: ${chatbotid})`,
  );

  try {
    //  fetch chatbot characteristics
    const data = await getChatbot(chatbotid);

    if (!data) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    // fetch previous messages
    const messagesData = await getChatbotSession(chatsessionid);

    const previousMessages = messagesData.messages;

    const formattedPreviousMessages: ChatCompletionMessageParam[] =
      previousMessages.map((message: any) => ({
        role: message.sender === "ai" ? "system" : "user",
        name: message.sender == "ai" ? "system" : "user",
        content: message.content,
      }));

    // combine characteristis into a system prompt

    const systemPrompt = data.chatbotcharacteristics
      .map((c: any) => c.content)
      .join(" + ");

    console.log(systemPrompt);

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        name: "system",
        content: `You are HiveGO helpful assistant. if a generic question is asked which is not relevant or in the same scope or domain as the points in the mentioned in the key information section, kindly inform the user they are only allowed to search for the sppecified content. Use Emoji's where possible, Here is some key information they you need to be aware of, these are elements you may asked about: ${systemPrompt}`,
      },
      ...formattedPreviousMessages,
      {
        role: "user",
        name: name,
        content: content,
      },
    ];

    // Step 3: send the message to OpenAi completion API
    const openaiResponse = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-5-mini",
    });

    const aiResponse = openaiResponse?.choices?.[0]?.message?.content?.trim();

    if (!aiResponse) {
      return NextResponse.json(
        { error: "Failed to generate AI response" },
        { status: 500 },
      );
    }

    // Or get from headers
    const authHeader = req.headers.get("X-Auth-Token");
    const authToken = token || authHeader;

    // Create a server-side axios instance with the token
    const axiosServer = Axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    });

    // Use this for your requests
    await axiosServer.post("/api/v1/chatbotmessage/upsert", {
      chatsessionid,
      content,
      sender: "user",
    });

    const aiMessageResult = await axiosServer.post(
      "/api/v1/chatbotmessage/upsert",
      {
        chatsessionid: chatsessionid,
        content: aiResponse,
        sender: "ai",
      },
    );

    return NextResponse.json({
      id: aiMessageResult.id,
      content: aiResponse,
    });

    // save the user message in the database
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
