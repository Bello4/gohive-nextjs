"use client";

import { ChatSession } from "@/types/chatbot";
import TimeAgo from "react-timeago";
import Link from "next/link";

function ChatbotSession({ chatsession }: { chatsession: ChatSession }) {
  return (
    <li className="relative">
      <div className="max-w-4xl px-10 my-4 py-6 bg-gray-100 rounded-lg shadow-md">
        <div className="flex  justify-between items-center">
          <span className="font-light text-gray-600">
            <TimeAgo date={new Date(chatsession.created_at)} />
          </span>
          <p className="px-2 py-1 bg-gray-600 text-gray-100 font-bold rounded hover:bg-gray-500">
            {chatsession.user.name}
          </p>
        </div>
        <div className="mt-2">
          <a
            className="text-2xl text-gray-700 font-bold hover:text-gray-600"
            href="#"
          >
            {chatsession.user.email}
          </a>
          <p className="mt-2 text-gray-600">{chatsession.user.phone}</p>
        </div>
        <div className="mt-2">
          <p className="mt-2 text-gray-600">
            {chatsession.messages?.length || 0} messages
          </p>
        </div>

        {chatsession.messages?.length > 0 && (
          <div className="flex justify-between items-center mt-2">
            <Link
              className="text-blue-600 hover:underline"
              href={`/dashboard/admin/review-sessions/message/${chatsession.id}`}
            >
              Read message
            </Link>
          </div>
        )}
      </div>
    </li>
  );
}

export default ChatbotSession;
