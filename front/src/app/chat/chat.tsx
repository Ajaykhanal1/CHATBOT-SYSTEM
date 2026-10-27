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

const COOLDOWN = 60 * 1000;
const COOLDOWN_KEY = "newChatCooldown";

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
  const [newChatDisabled, setNewChatDisabled] = useState(false);

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

  useEffect(() => {
    const checkCooldown = () => {
      const cooldownUntil = localStorage.getItem(COOLDOWN_KEY);

      if (!cooldownUntil) {
        setNewChatDisabled(false);
        return;
      }

      const remaining = Number(cooldownUntil) - Date.now();

      if (remaining > 0) {
        setNewChatDisabled(true);
      } else {
        localStorage.removeItem(COOLDOWN_KEY);
        setNewChatDisabled(false);
      }
    };

    checkCooldown();

    const interval = setInterval(checkCooldown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || creating || newChatDisabled) return;

    try {
      setCreating(true);

      const cooldownUntil = Date.now() + COOLDOWN;
      localStorage.setItem(COOLDOWN_KEY, cooldownUntil.toString());
      setNewChatDisabled(true);

      const res = await api.post("/chats");
      const newChat = res.data;

      await api.post(`/messages/${newChat._id}`, {
        content: message.trim(),
      });

      setMessage("");
      router.push(`/chat/${newChat._id}`);
    } catch (error) {
      console.error("Failed to start chat:", error);
      localStorage.removeItem(COOLDOWN_KEY);
      setNewChatDisabled(false);
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
      <div className="pointer-events-none absolute inset-0 -z-10 bg-noise opacity-60" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-20" />
      <ChatSidebar />

      <section className="flex min-w-0 flex-1 flex-col">
        <ChatHeader />

        {chatId ? (
          <>
            <ChatMessages key={`cm-${chatId}`} chatId={chatId} />
            <ChatInput key={`ci-${chatId}`} chatId={chatId} />
          </>
        ) : (
          <div className="relative flex flex-1 flex-col items-center justify-center px-6">
            <div className="w-full max-w-3xl text-center">
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-accent" />
                <span>Ready to chat</span>
              </div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Start a new conversation
              </h1>
              <p className="mt-3 text-balance text-muted-foreground">
                Pick a model from the header and ask anything to get going.
              </p>

              <form onSubmit={handleStart} className="mt-8">
                <div className="flex items-end gap-2 rounded-[1.75rem] border border-white/10 bg-white/5 p-2 shadow-lg shadow-black/20 backdrop-blur">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    rows={1}
                    className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    disabled={creating || newChatDisabled}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || creating || newChatDisabled}
                    className="group relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <SendHorizontal className="relative z-10 h-4 w-4" />
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {newChatDisabled ? "New chat on cooldown (1 min)" : "AI can make mistakes. Check important information."}
                </p>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}