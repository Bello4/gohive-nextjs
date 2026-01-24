import { getChatbotSession } from "@/queries/chatbot";
import { ChatSession } from "@/types/chatbot";
import { SiteHeader } from "@/components/site-header";
import Messages from "@/components/chatbotui/Messages";

async function page({ params: { id } }: { params: { id: string } }) {
  const botData = await getChatbotSession(id);
  // const [newCharacteristic, setNewCharacteristic] = useState<string>("");

  if (!botData) {
    return;
  }

  return (
    <>
      <SiteHeader header={`Chat  Sessions message`} />
      <div className="flex flex-1 flex-col">
        <div className="flex-1 p-10 pb-24 bg-gray-100">
          <p className="font-light text-xs text-gray-400 mt-2">
            Started at {new Date(botData.created_at).toLocaleString()}
          </p>
          <h2 className="font-light mt-2">Between</h2>
          <hr className="my-10" />
          <Messages messages={botData?.messages} chatBotName="package" />
        </div>
      </div>
    </>
  );
}

export default page;
