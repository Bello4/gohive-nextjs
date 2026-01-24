import { User } from "./user";

export interface Chatbot {
  id: number;
  name: string;
  image: string;
  chatbotcharacteristics: ChatbotCharacteristic[];
  chatsession: ChatSession[];
}

export interface ChatbotCharacteristic {
  id: number;
  chatbotid: number;
  content: string;
}

export interface ChatSession {
  id: number;
  userid: number | null;
  chatbotid: number;
  messages: Message[];
  user: User;
  created_at: string;
}

export interface Message {
  id: number;
  content: string;
  sender: "ai" | "user";
  chatsessionid: number;
  created_at: string;
}

export interface GetChatbotByIdResponse {
  chatbots: Chatbot;
}
