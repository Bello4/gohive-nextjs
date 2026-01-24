"use client";

import { ChatbotCharacteristic } from "@/types/chatbot";
import { OctagonX } from "lucide-react";
import { deleteChatbotCharacteristic } from "@/queries/chatbot";
import { useRouter } from "next/navigation";
// import { showToast } from "nextjs-toast-notify";
import toast from "react-hot-toast";

function Characteristic({
  characteristic,
}: {
  characteristic: ChatbotCharacteristic;
}) {
  const router = useRouter();

  return (
    <li className="relative p-10 bg-white border ronded-md">
      {characteristic.content}

      <OctagonX
        onClick={async () => {
          await deleteChatbotCharacteristic(characteristic.id);
          toast.success(`Chatbot responce character is deleted.`);
          router.refresh();
        }}
        className="w-6 h-6 text-white fill-red-500 absolute cursor-pointer top-1 right-1"
      />
    </li>
  );
}

export default Characteristic;
