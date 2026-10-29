"use client";

import { useState } from "react";
import { api } from "@/lib/axios/axios";
import { SendHorizontal } from "lucide-react";

export default function ChatInput({ chatId }: { chatId: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    try {
      setLoading(true);
      await api.post(`/messages/${chatId}`, {
        content: message.trim(),
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
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

  return (
    <div className="border-t border-border px-0 py-3">
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl">
        <div className="relative flex items-end rounded-3xl border border-border bg-card p-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            rows={1}
            className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          AI can make mistakes. Check important information.
        </p>
      </form>
    </div>
  );
}
