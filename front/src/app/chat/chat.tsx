"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessages from "../components/chat/ChatMessages";
import ChatInput from "../components/chat/ChatInput";
import { api } from "@/lib/axios/axios";
import { SendHorizontal } from "lucide-react";

import { SpinnerCustom } from "../../components/ui/spinner";

export default function ChatPage({
  chatId,
}: {
  chatId?: string;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);

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

  const handleStart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || creating) return;

    try {
      setCreating(true);

      const res = await api.post("/chats");
      const newChat = res.data;

      sessionStorage.setItem(`pendingPrompt:${newChat._id}`, message.trim());
      window.dispatchEvent(new Event("chats:changed"));

      setMessage("");
      router.push(`/chat/${newChat._id}`);
    } catch (error) {
      console.error("Failed to start chat:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <SpinnerCustom />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="relative flex h-screen overflow-hidden bg-background text-foreground">
      <aside className="hidden h-full w-[260px] shrink-0 md:block">
        <ChatSidebar />
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <ChatHeader chatId={chatId} />

        {chatId ? (
          <>
            <ChatMessages key={`cm-${chatId}`} chatId={chatId} />
            <ChatInput key={`ci-${chatId}`} chatId={chatId} />
          </>
        ) : (
          <div className="relative flex flex-1 flex-col items-center justify-center px-0">
            <div className="w-full max-w-3xl text-center">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                What can I help with?
              </h1>

              <form onSubmit={handleStart} className="mt-8">
                <div className="relative mx-auto flex items-end rounded-3xl border border-border bg-card p-2 shadow-sm">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message..."
                    rows={1}
                    className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    disabled={creating}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || creating}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {creating ? "Starting chat..." : ""}
                </p>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
