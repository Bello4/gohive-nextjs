import { SiteHeader } from "@/components/site-header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getChatbot } from "@/queries/chatbot";
import { Input } from "@/components/ui/input";
import { ChatbotCharacteristic } from "@/types/chatbot";
import Characteristic from "@/components/chatbotui/Characteristic";
import CharacteristicDetails from "@/components/dashboard/forms/characteristic-detail";
// import { useState } from "react";

async function page({ params: { id } }: { params: { id: string } }) {
  const botData = await getChatbot(id);
  // const [newCharacteristic, setNewCharacteristic] = useState<string>("");

  if (!botData) {
    return;
  }

  // console.log(botData);
  return (
    <>
      <SiteHeader header={`${botData.name} Chat Bot `} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6">
            <div className=" flex justify-center align-center">
              <div className=" flex-row">
                <div className="relative h-30 min-w-50 rounded-xl overflow-hidden">
                  <Image
                    src={botData.image}
                    alt=""
                    width={1000}
                    height={1000}
                    className="w-25 h-25 rounded-full object-cover "
                  />
                </div>
                <h1 className="font-bold text-2xl">{botData.name}</h1>
              </div>
            </div>
            <section className="relative bg-gray-100 p-5 md:p-p10 rounded-lg">
              <Button
                className="absolute top-2 right-2 h-8 w-2"
                variant="destructive"
              >
                X
              </Button>

              <h2 className="text-xl font-bold mt-10">
                Here is what you {botData.name} chat bot knows...
              </h2>
              <p>
                Your chatbot is equipped with the following information to assit
                you in your conversation with customers.
              </p>

              <div>
                {/* <form>
                  <Input
                    type="text"
                    placeholder="Example: if customers ask for price, provide pricing page link"
                    // value={newCharacteristic}
                    // onChange={(e) => setNewCharacteristic(e.target.value)}
                  />
                  <Button
                    type="submit"
                    // disabled={!newCharacteristic}
                  >
                    Add
                  </Button>
                </form> */}

                <CharacteristicDetails chatbotId={botData.id} />

                <ul className="flex flex-wrap-reverse gap-5 mt-4">
                  {botData?.chatbotcharacteristics.map(
                    (characteristic: ChatbotCharacteristic) => {
                      return (
                        <Characteristic
                          key={characteristic.id}
                          characteristic={characteristic}
                        />
                      );
                    },
                  )}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
