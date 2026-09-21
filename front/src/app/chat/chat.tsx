"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessages from "../components/chat/ChatMessages";
import ChatInput from "../components/chat/ChatInput";

import { SpinnerCustom } from "../../components/ui/spinner";

export default function ChatPage({
  chatId,
}: {
  chatId?: string;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);  

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      setIsAuthenticated(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <SpinnerCustom />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
  <main className="flex h-screen overflow-hidden bg-white text-black">
    <ChatSidebar />

    <section className="flex min-w-0 flex-1 flex-col">
      <ChatHeader />

      {chatId ? (
        <>
          <ChatMessages chatId={chatId} />
          <ChatInput chatId={chatId} />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">
            Start a new conversation
          </p>
        </div>
      )}
    </section>
  </main>
);
}