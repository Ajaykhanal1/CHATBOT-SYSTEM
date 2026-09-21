"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios/axios";

type Message = {
  _id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatMessages({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    api.get(`/messages/${chatId}`).then((res) => {
      setMessages(res.data);
    });
  }, [chatId]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`mb-8 flex gap-4 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                message.role === "user"
                  ? "bg-gray-200"
                  : "bg-black text-white"
              }`}
            >
              {message.role === "user" ? "A" : "AI"}
            </div>

            <div className="min-w-0 pt-1">
              <p className="mb-1 text-sm font-semibold">
                {message.role === "user" ? "You" : "AI"}
              </p>

              <p className="whitespace-pre-wrap leading-7 text-gray-700">
                {message.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}