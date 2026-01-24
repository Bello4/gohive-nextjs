import { getChatbot } from "@/queries/chatbot";
import ChatbotSession from "@/components/chatbotui/ChatbotSession";
import { ChatSession } from "@/types/chatbot";
import { SiteHeader } from "@/components/site-header";

async function ReviewSession({ params: { id } }: { params: { id: string } }) {
  const botData = await getChatbot(id);
  // const [newCharacteristic, setNewCharacteristic] = useState<string>("");

  if (!botData) {
    return;
  }

  return (
    <>
      <SiteHeader header={`Chat  Sessions for ${botData.name} Bot`} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
            <ul className="flex-row mt-4">
              {botData?.chatsession.map((chatsession: ChatSession) => {
                return (
                  <ChatbotSession
                    key={chatsession.id}
                    chatsession={chatsession}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewSession;
