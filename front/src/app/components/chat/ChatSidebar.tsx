"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios/axios";
import type { ActiveAccess } from "../payments/types";

type Chat = {
  _id: string;
  title: string;
};

const COOLDOWN = 60 * 1000;
const COOLDOWN_KEY = "newChatCooldown";

export default function ChatSidebar() {
  const router = useRouter();

  const [chats, setChats] = useState<Chat[]>([]);
  const [access, setAccess] = useState<ActiveAccess | null>(null);
  const [creating, setCreating] = useState(false);
  const [newChatDisabled, setNewChatDisabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await api.get("/chats");
        const data = Array.isArray(res.data) ? res.data : [];
        const map = new Map<string, Chat>();
        for (let i = 0; i < data.length; i++) {
          const c: any = data[i];
          if (c && c._id && !map.has(c._id)) {
            map.set(c._id, c);
          }
        }
        setChats(Array.from(map.values()));
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    };

    loadChats();
  }, []);

  useEffect(() => {
    let active = true;

    api
      .get<ActiveAccess>("/payments/access")
      .then((response) => {
        if (active) setAccess(response.data);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

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

  const handleNewChat = async () => {
    if (creating || newChatDisabled) return;

    try {
      setCreating(true);

      const cooldownUntil = Date.now() + COOLDOWN;

      localStorage.setItem(COOLDOWN_KEY, cooldownUntil.toString());

      setNewChatDisabled(true);

      const res = await api.post("/chats");

      const newChat = res.data;

      setChats((prev) => {
        if (prev.some((c) => c._id === newChat._id)) return prev;
        return [newChat, ...prev];
      });

      startTransition(() => {
        router.push(`/chat/${newChat._id}`, { scroll: false } as any);
      });
    } catch (error) {
      console.error("Failed to create chat:", error);

      localStorage.removeItem(COOLDOWN_KEY);
      setNewChatDisabled(false);
    } finally {
      setCreating(false);
    }
  };

  const handleStartRename = (e: React.MouseEvent, chat: Chat) => {
    e.preventDefault();
    e.stopPropagation();

    setEditingChatId(chat._id);
    setEditingTitle(chat.title);
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingChatId || !editingTitle.trim()) return;

    try {
      const res = await api.put(`/chats/${editingChatId}`, {
        title: editingTitle.trim(),
      });

      const updatedChat = res.data;

      setChats((prev) =>
        prev.map((chat) => (chat._id === updatedChat._id ? updatedChat : chat))
      );

      setEditingChatId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("Failed to rename chat:", error);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm("Are you sure you want to delete this chat?");

    if (!confirmed) return;

    try {
      setDeletingChatId(chatId);

      await api.delete(`/chats/${chatId}`);

      setChats((prev) => prev.filter((chat) => chat._id !== chatId));

      if (window.location.pathname === `/chat/${chatId}`) {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    } finally {
      setDeletingChatId(null);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center justify-between px-3">
        <Link href="/" className="flex items-center gap-2 px-2 text-sm font-medium">
          <span>MyChat</span>
        </Link>

        <span
          title={
            access?.expiresAt
              ? `Active until ${new Date(access.expiresAt).toLocaleDateString()}`
              : "Free plan"
          }
          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
            access && access.plan !== "free"
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border text-muted-foreground"
          }`}
        >
          {access?.planName || "Free"}
        </span>
      </div>

      <div className="px-2">
        <button
          type="button"
          onClick={handleNewChat}
          disabled={creating || newChatDisabled}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-sidebar-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>+ New chat</span>
        </button>
      </div>

      <div className="px-2 pb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-0.5">
          {filteredChats.map((chat, idx) => (
            <div key={chat._id || `chat-${idx}`} className="group relative">
              {editingChatId === chat._id ? (
                <form onSubmit={handleRename} className="flex items-center gap-1 px-1">
                  <input
                    autoFocus
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setEditingChatId(null);
                        setEditingTitle("");
                      }
                    }}
                    className="min-w-0 flex-1 rounded-md border border-border bg-transparent px-2 py-1 text-sm outline-none"
                  />
                  <button type="submit" className="rounded-md px-2 py-1 text-xs hover:bg-sidebar-accent">
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex items-center">
                  <Link
                    href={`/chat/${chat._id}`}
                    prefetch={false}
                    className="min-w-0 flex-1 truncate rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-sidebar-accent"
                  >
                    {chat.title}
                  </Link>
                  <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => handleStartRename(e, chat)}
                      className="rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      title="Rename"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M11.5 2.5l2 2L6 12H4v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      disabled={deletingChatId === chat._id}
                      className="rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground disabled:opacity-50"
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M4 5h8M6 5V4a1 1 0 011-1h2a1 1 0 011 1v1M6.5 7.5v4M9.5 7.5v4M5 5l.5 7a1 1 0 001 1h3a1 1 0 001-1l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border p-2">
        <Link href="/profile" className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-sidebar-accent">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">Ajay</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}