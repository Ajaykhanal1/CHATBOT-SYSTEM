"use client";

import { useParams } from "next/navigation";
import ChatPage from "../chat";

export default function ChatIdRoute() {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="min-h-screen bg-white">
      <ChatPage chatId={id} />
    </main>
  );
}