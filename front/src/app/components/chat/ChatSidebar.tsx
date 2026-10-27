"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios/axios";

type Chat = {
  _id: string;
  title: string;
};

const COOLDOWN = 60 * 1000;
const COOLDOWN_KEY = "newChatCooldown";

export default function ChatSidebar() {
  const router = useRouter();

  const [chats, setChats] = useState<Chat[]>([]);
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
    <aside className="relative flex h-full w-full flex-col border-r border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      <div className="flex h-16 items-center px-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent">
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
          </span>
          <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            MyChat
          </span>
        </Link>
      </div>

      <div className="p-4">
        <button
          type="button"
          onClick={handleNewChat}
          disabled={creating || newChatDisabled}
          className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="relative z-10">
            {creating ? "Creating..." : newChatDisabled ? "New Chat (1 min)" : "+ New Chat"}
          </span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </div>

      <div className="px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Recent
        </p>

        <div className="space-y-1">
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
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                  />
                  <button type="submit" className="rounded-xl bg-gradient-to-r from-primary to-accent px-3 py-2 text-xs text-primary-foreground">
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex items-center">
                  <Link
                    href={`/chat/${chat._id}`}
                    prefetch={false}
                    className="min-w-0 flex-1 truncate rounded-2xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-white/5"
                  >
                    {chat.title}
                  </Link>
                  <div className="hidden items-center gap-1 pr-1 group-hover:flex">
                    <button
                      type="button"
                      onClick={(e) => handleStartRename(e, chat)}
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                      title="Rename"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.5 2.5l2 2L6 12H4v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      disabled={deletingChatId === chat._id}
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                      title="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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

      <div className="border-t border-white/5 p-4">
        <Link href="/profile" className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-white/5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-medium text-primary-foreground">
            A
          </div>
          <div>
            <p className="text-sm font-medium">Ajay</p>
            <p className="text-xs text-muted-foreground">Free Plan</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}