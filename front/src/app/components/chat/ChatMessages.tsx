"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  Check,
  Copy,
  Pencil,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { api } from "@/lib/axios/axios";
import { getSocket } from "@/lib/socket";
import { formatTime } from "@/lib/time";

type Message = {
  _id: string;
  role: "user" | "assistant";
  content: string;
  feedback?: "like" | "dislike" | null;
  createdAt?: string;
};

type SocketChatPayload = {
  chatId?: string;
  userMessage?: Message;
  aiMessage?: Message | null;
  content?: string;
  message?: Message | string;
};

const markdownPlugins = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeHighlight],
};

export default function ChatMessages({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [streaming, setStreaming] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentChatIdRef = useRef(chatId);

  const addMessage = (message: Message) => {
    if (!message?._id) return;
    setMessages((prev) =>
      prev.some((item) => item._id === message._id)
        ? prev
        : [...prev, message]
    );
  };

  useEffect(() => {
    currentChatIdRef.current = chatId;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages([]);
    setStreaming("");
    setGenerating(false);
    setError("");
    setEditingId(null);
    setLoading(true);
  }, [chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/messages/${chatId}`);
        if (currentChatIdRef.current !== chatId) return;
        const data = Array.isArray(res.data) ? res.data : [];
        setMessages((prev) => {
          const map = new Map<string, Message>();
          for (const message of [...prev, ...(data as Message[])]) {
            if (message?._id && !map.has(message._id)) {
              map.set(message._id, message);
            }
          }
          return Array.from(map.values()).sort(
            (a, b) =>
              new Date(a.createdAt || 0).getTime() -
              new Date(b.createdAt || 0).getTime()
          );
        });
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

    const isCurrent = (payload: SocketChatPayload) =>
      payload?.chatId === currentChatIdRef.current;

    const onUser = (payload: SocketChatPayload) => {
      if (isCurrent(payload) && payload.userMessage) {
        addMessage(payload.userMessage);
      }
    };

    const onStart = (payload: SocketChatPayload) => {
      if (!isCurrent(payload)) return;
      setGenerating(true);
      setStreaming("");
      setError("");
    };

    const onChunk = (payload: SocketChatPayload) => {
      if (!isCurrent(payload)) return;
      setStreaming((prev) => prev + (payload.content || ""));
    };

    const onDone = (payload: SocketChatPayload) => {
      if (!isCurrent(payload)) return;
      if (payload.aiMessage) addMessage(payload.aiMessage);
      setStreaming("");
      setGenerating(false);
    };

    const onError = (payload: SocketChatPayload) => {
      if (!isCurrent(payload)) return;
      setStreaming("");
      setGenerating(false);
      setError(
        typeof payload.message === "string"
          ? payload.message
          : "Something went wrong"
      );
    };

    const onUpdated = (payload: SocketChatPayload) => {
      if (!isCurrent(payload) || !payload.message) return;
      const updated = payload.message;
      if (typeof updated === "string") return;
      setMessages((prev) => {
        const index = prev.findIndex((item) => item._id === updated._id);
        if (index === -1) return prev;
        return [
          ...prev.slice(0, index + 1),
          { ...prev[index], ...updated },
        ];
      });
    };

    const onCleared = (payload: SocketChatPayload) => {
      if (!isCurrent(payload)) return;
      setMessages([]);
      setStreaming("");
      setGenerating(false);
      setError("");
    };

    socket.on("message:user", onUser);
    socket.on("message:start", onStart);
    socket.on("message:chunk", onChunk);
    socket.on("message:done", onDone);
    socket.on("message:error", onError);
    socket.on("message:updated", onUpdated);
    socket.on("chat:cleared", onCleared);

    return () => {
      socket.off("message:user", onUser);
      socket.off("message:start", onStart);
      socket.off("message:chunk", onChunk);
      socket.off("message:done", onDone);
      socket.off("message:error", onError);
      socket.off("message:updated", onUpdated);
      socket.off("chat:cleared", onCleared);
    };
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: streaming ? "auto" : "smooth",
    });
  }, [messages, streaming, generating, error]);

  const copyMessage = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message._id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const sendFeedback = async (
    message: Message,
    value: "like" | "dislike"
  ) => {
    const next = message.feedback === value ? null : value;

    setMessages((prev) =>
      prev.map((item) =>
        item._id === message._id ? { ...item, feedback: next } : item
      )
    );

    try {
      await api.patch(`/messages/${chatId}/${message._id}/feedback`, {
        feedback: next,
      });
    } catch (error) {
      console.error("Failed to save feedback:", error);
      setMessages((prev) =>
        prev.map((item) =>
          item._id === message._id
            ? { ...item, feedback: message.feedback }
            : item
        )
      );
    }
  };

  const regenerate = async () => {
    if (generating) return;

    setMessages((prev) => {
      const lastUser = [...prev]
        .reverse()
        .find((message) => message.role === "user");
      if (!lastUser) return prev;
      const index = prev.findIndex((message) => message._id === lastUser._id);
      return prev.slice(0, index + 1);
    });
    setGenerating(true);
    setStreaming("");
    setError("");

    try {
      await api.post(`/messages/${chatId}/regenerate`);
    } catch (error) {
      console.error("Failed to regenerate response:", error);
      setGenerating(false);
      setError("Failed to regenerate response");
    }
  };

  const startEdit = (message: Message) => {
    setEditingId(message._id);
    setEditValue(message.content);
  };

  const saveEdit = async (message: Message) => {
    const content = editValue.trim();

    if (!content || generating) return;

    setMessages((prev) => {
      const index = prev.findIndex((item) => item._id === message._id);
      if (index === -1) return prev;
      return [
        ...prev.slice(0, index),
        { ...prev[index], content },
      ];
    });

    setEditingId(null);
    setEditValue("");
    setGenerating(true);
    setStreaming("");
    setError("");

    try {
      await api.put(`/messages/${chatId}/${message._id}`, { content });
    } catch (error) {
      console.error("Failed to edit message:", error);
      setGenerating(false);
      setError("Failed to edit message");
    }
  };

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

  const lastAssistantId = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")?._id;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-0 py-6">
        {messages.map((message, idx) => {
          const isLast = idx === messages.length - 1;

          if (message.role === "user") {
            return (
              <div key={message._id} className="group mb-6 flex flex-col items-end">
                {editingId === message._id ? (
                  <div className="w-full max-w-[85%] rounded-2xl border border-border bg-card p-2">
                    <textarea
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={2}
                      className="max-h-60 w-full resize-none bg-transparent p-1 text-sm outline-none"
                    />
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditValue("");
                        }}
                        className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEdit(message)}
                        className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground hover:opacity-90"
                      >
                        Save &amp; send
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                )}

                {editingId !== message._id ? (
                  <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    <span className="text-[10px] text-muted-foreground">
                      {formatTime(message.createdAt)}
                    </span>
                    <button
                      type="button"
                      onClick={() => startEdit(message)}
                      className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                      title="Edit message"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : null}
              </div>
            );
          }

          return (
            <div key={message._id} className="group mb-6 flex gap-2">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs">
                AI
              </div>
              <div className="min-w-0 flex-1 py-1">
                <div className="chat-markdown text-sm leading-relaxed">
                  {message.content ? (
                    <ReactMarkdown {...markdownPlugins}>
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <span className="text-muted-foreground">No response</span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  <span className="mr-1 text-[10px] text-muted-foreground">
                    {formatTime(message.createdAt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyMessage(message)}
                    className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                    title="Copy response"
                  >
                    {copiedId === message._id ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => sendFeedback(message, "like")}
                    className={`rounded-md p-1 hover:bg-accent hover:text-foreground ${
                      message.feedback === "like"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                    title="Good response"
                  >
                    <ThumbsUp
                      className={`h-3.5 w-3.5 ${
                        message.feedback === "like" ? "fill-current" : ""
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => sendFeedback(message, "dislike")}
                    className={`rounded-md p-1 hover:bg-accent hover:text-foreground ${
                      message.feedback === "dislike"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                    title="Bad response"
                  >
                    <ThumbsDown
                      className={`h-3.5 w-3.5 ${
                        message.feedback === "dislike" ? "fill-current" : ""
                      }`}
                    />
                  </button>
                  {message._id === lastAssistantId && isLast ? (
                    <button
                      type="button"
                      onClick={regenerate}
                      disabled={generating}
                      className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
                      title="Regenerate response"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}

        {generating ? (
          <div className="mb-6 flex gap-2">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs">
              AI
            </div>
            <div className="min-w-0 flex-1 py-1">
              {streaming ? (
                <div className="chat-markdown text-sm leading-relaxed">
                  <ReactMarkdown {...markdownPlugins}>
                    {streaming}
                  </ReactMarkdown>
                  <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-foreground align-middle" />
                </div>
              ) : (
                <div className="flex items-center gap-1 py-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        ) : null}

        {error && !generating ? (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
            <span className="flex-1 text-muted-foreground">{error}</span>
            <button
              type="button"
              onClick={regenerate}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-accent"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        ) : null}

        {!generating &&
        !error &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" ? (
          <div className="mb-6">
            <button
              type="button"
              onClick={regenerate}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry response
            </button>
          </div>
        ) : null}

        {!messages.length && !generating ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Start the conversation by sending a message.
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
