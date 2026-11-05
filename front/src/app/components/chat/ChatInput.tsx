"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizontal, Square } from "lucide-react";
import { api } from "@/lib/axios/axios";
import { isAxiosError } from "axios";

export default function ChatInput({ chatId }: { chatId: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const controllerRef = useRef<AbortController | null>(null);

  const send = async (content: string) => {
    const value = content.trim();

    if (!value || loading) return;

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");

    try {
      await api.post(
        `/messages/${chatId}`,
        { content: value },
        { signal: controller.signal }
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error("Failed to send message:", error);
        setError(
          isAxiosError(error)
            ? error.response?.data?.message || "Failed to send message"
            : "Failed to send message"
        );
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const key = `pendingPrompt:${chatId}`;
    const pending = sessionStorage.getItem(key);

    if (pending) {
      sessionStorage.removeItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessage(pending);
      setTimeout(() => void send(pending), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    const content = message;
    setMessage("");
    await send(content);
  };

  const handleStop = () => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
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
            type={loading ? "button" : "submit"}
            onClick={loading ? handleStop : undefined}
            disabled={!message.trim() && !loading}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            title={loading ? "Stop generating" : "Send message"}
          >
            {loading ? (
              <Square className="h-3.5 w-3.5 fill-current" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </button>
        </div>
        {error ? (
          <p className="mt-1.5 text-center text-xs text-destructive">{error}</p>
        ) : (
          <p className="mt-1.5 text-center text-xs text-muted-foreground">
            AI can make mistakes. Check important information.
          </p>
        )}
      </form>
    </div>
  );
}
