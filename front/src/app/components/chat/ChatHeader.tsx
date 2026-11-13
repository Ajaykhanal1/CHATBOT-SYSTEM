"use client";

import { useState } from "react";
import { Eraser, Menu } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/axios/axios";
import ModelSelector from "./ModelSelector";
import ChatSidebar from "./ChatSidebar";
import ThemeToggle from "@/components/theme/theme-toggle";

export default function ChatHeader({ chatId }: { chatId?: string }) {
  const [clearing, setClearing] = useState(false);

  const handleClear = async () => {
    if (!chatId || clearing) return;

    const confirmed = window.confirm(
      "Clear all messages in this conversation?"
    );

    if (!confirmed) return;

    try {
      setClearing(true);
      await api.delete(`/chats/${chatId}/messages`);
    } catch (error) {
      console.error("Failed to clear chat:", error);
    } finally {
      setClearing(false);
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-4">
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger className="md:hidden">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </DialogTrigger>
          <DialogContent className="left-0 top-0 h-[100dvh] w-[260px] translate-x-0 translate-y-0 rounded-none border-0 p-0">
            <ChatSidebar />
          </DialogContent>
        </Dialog>

        <ModelSelector />
      </div>

      <div className="flex items-center gap-2">
        {chatId ? (
          <button
            type="button"
            onClick={handleClear}
            disabled={clearing}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
            title="Clear conversation"
          >
            <Eraser className="h-4 w-4" />
            <span className="hidden sm:inline">
              {clearing ? "Clearing..." : "Clear"}
            </span>
          </button>
        ) : null}
        <ThemeToggle />
      </div>
    </header>
  );
}
