"use client";

import { useState } from "react";
import { api } from "@/lib/axios/axios";

export default function ChatInput({ chatId }: { chatId: string }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      await api.post(`/messages/${chatId}`, {
        content: message.trim(),
      });

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    // Enter = Submit
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const form = e.currentTarget.form;

      if (form) {
        form.requestSubmit();
      }
    }

    // Shift + Enter = New line
  };

  return (
    <div className="border-t bg-white px-4 py-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-gray-300 bg-white p-2 shadow-sm">

          {/* Plus */}
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg hover:bg-gray-100"
          >
            +
          </button>

          {/* Message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI..."
            rows={1}
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
          />

          {/* Microphone */}
          <button
            type="button"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-gray-100 sm:flex"
          >
            🎙
          </button>

          {/* Send */}
          <button
            type="submit"
            disabled={!message.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            ↑
          </button>
        </div>

        <p className="mt-2 text-center text-xs text-gray-400">
          AI can make mistakes. Check important information.
        </p>
      </form>
    </div>
  );
}
