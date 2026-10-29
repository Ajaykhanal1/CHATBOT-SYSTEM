"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios/axios";
import { getSocket } from "@/lib/socket";

type Message = {
  _id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatMessages({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentChatIdRef = useRef(chatId);

  useEffect(() => {
    currentChatIdRef.current = chatId;
    setMessages([]);
    setLoading(true);
  }, [chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/messages/${chatId}`);
        if (currentChatIdRef.current !== chatId) return;
        const data = Array.isArray(res.data) ? res.data : [];
        const map = new Map<string, Message>();
        for (let i = 0; i < data.length; i++) {
          const m: any = data[i];
          if (!m || !m._id) continue;
          if (!map.has(m._id)) {
            map.set(m._id, m);
          }
        }
        if (currentChatIdRef.current !== chatId) return;
        setMessages(Array.from(map.values()));
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        if (currentChatIdRef.current === chatId) {
          setLoading(false);
        }
      }
    };

    if (chatId) fetchMessages();
  }, [chatId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !chatId) return;

    socket.emit("chat:join", { chatId });

    const handler = (payload: any) => {
      if (payload?.chatId !== currentChatIdRef.current) return;
      if (payload?.chatId !== chatId) return;
      setMessages((prev) => {
        const next = [...prev];
        const add = (m: any) => {
          if (!m || !m._id) return;
          for (let i = 0; i < next.length; i++) {
            if (next[i]._id === m._id) return;
          }
          next.push(m);
        };
        add(payload.userMessage);
        add(payload.aiMessage);
        return next;
      });
    };

    socket.on("message:new", handler);

    return () => {
      socket.off("message:new", handler);
    };
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          <span>Loading conversation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-0 py-6">
        {(() => {
          const seen = new Set<string>();
          const unique = messages.filter((m) => {
            if (!m?._id) return false;
            if (seen.has(m._id)) return false;
            seen.add(m._id);
            return true;
          });
          return unique.map((message, idx) => (
            <div key={`${message._id}-${idx}`} className="mb-6">
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground">
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs">
                    AI
                  </div>
                  <div className="min-w-0 flex-1 py-1 text-sm leading-relaxed">
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                </div>
              )}
            </div>
          ));
        })()}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
