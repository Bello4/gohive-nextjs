import axios from "@/lib/axios";

export async function getallChatbot() {
  const response = await axios.get(`/api/v1/chatbots`);
  return response.data.chatbots;
}
// Get a chatbot
export async function getChatbot(id: string | number) {
  const response = await axios.get(`/api/v1/chatbot/${id}`);
  return response.data.chatbot;
}

export async function getChatbotSession(id: string | number) {
  const response = await axios.get(`/api/v1/chatbotsession/${id}`);
  return response.data.chatbotsession;
}

export async function createChatbotMessage(chatbotmessage: {
  id?: number;
  content: string;
  sender: string;
  chatsessionid: number;
}) {
  const response = await axios.post(
    "/api/v1/chatbotmessage/upsert",
    chatbotmessage,
  );
  return response.data.chatbotmessage;
}

export async function upsertChatbot(chatbot: {
  id?: string;
  name: string;
  image?: string;
}) {
  const response = await axios.post("/api/v1/chatbot/upsert", chatbot);
  return response.data.category;
}

export async function upsertChatbotCharacter(chatbotcharacter: {
  id?: string;
  content: string;
  chatbotId: number;
}) {
  const response = await axios.post(
    "/api/v1/chatbotcharacter/upsert",
    chatbotcharacter,
  );
  return response.data.chatbotcharacteristic;
}

export async function createChatbotSession(chatbotsession: {
  id?: string;
  chatbotid: number;
  userid: number;
}) {
  const response = await axios.post(
    "/api/v1/chatbotsession/upsert",
    chatbotsession,
  );
  return response.data.chatbotsession;
}

// Delete Category
export async function deleteChatbot(id: string | number) {
  const response = await axios.delete(`/api/v1/chatbot/${id}`);
  return response.data;
}

export async function deleteChatbotCharacteristic(id: string | number) {
  const response = await axios.delete(`/api/v1/chatbotcharacteristic/${id}`);
  return response.data;
}
