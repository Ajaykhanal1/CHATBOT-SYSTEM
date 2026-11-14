"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArchiveRestore,
  Pencil,
  Pin,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { api } from "@/lib/axios/axios";
import type { ActiveAccess } from "../payments/types";
import { getSocket } from "@/lib/socket";
import { formatRelative } from "@/lib/time";

type Chat = {
  _id: string;
  title: string;
  pinned?: boolean;
  favorite?: boolean;
  archived?: boolean;
  updatedAt?: string;
};

const sortChats = (list: Chat[]) =>
  [...list].sort(
    (a, b) =>
      Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) ||
      new Date(b.updatedAt || 0).getTime() -
        new Date(a.updatedAt || 0).getTime()
  );

export default function ChatSidebar() {
  const router = useRouter();

  const [chats, setChats] = useState<Chat[]>([]);
  const [access, setAccess] = useState<ActiveAccess | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

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
    const loadChats = async () => {
      try {
        const res = await api.get("/chats");
        const data = Array.isArray(res.data) ? res.data : [];
        const map = new Map<string, Chat>();
        for (const chat of data) {
          if (chat?._id && !map.has(chat._id)) {
            map.set(chat._id, chat);
          }
        }
        setChats(sortChats(Array.from(map.values())));
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    };

    loadChats();

    window.addEventListener("chats:changed", loadChats);

    const socket = getSocket();
    const upsert = (chat: Chat) => {
      if (!chat?._id) return;
      setChats((prev) =>
        sortChats(
          prev.some((item) => item._id === chat._id)
            ? prev.map((item) => (item._id === chat._id ? chat : item))
            : [chat, ...prev]
        )
      );
    };
    const remove = (payload: { chatId?: string }) => {
      if (payload?.chatId) {
        setChats((prev) => prev.filter((chat) => chat._id !== payload.chatId));
      }
    };

    socket?.on("chat:updated", upsert);
    socket?.on("chat:deleted", remove);

    return () => {
      window.removeEventListener("chats:changed", loadChats);
      socket?.off("chat:updated", upsert);
      socket?.off("chat:deleted", remove);
    };
  }, []);

  const handleNewChat = () => {
    router.push("/chat");
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
        sortChats(
          prev.map((chat) =>
            chat._id === updatedChat._id ? updatedChat : chat
          )
        )
      );

      setEditingChatId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("Failed to rename chat:", error);
    }
  };

  const handleToggleFlag = async (
    e: React.MouseEvent,
    chat: Chat,
    key: "pinned" | "favorite" | "archived"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const next = !chat[key];

    setChats((prev) =>
      sortChats(
        prev.map((item) =>
          item._id === chat._id ? { ...item, [key]: next } : item
        )
      )
    );

    try {
      const res = await api.put(`/chats/${chat._id}`, { [key]: next });
      setChats((prev) =>
        sortChats(
          prev.map((item) => (item._id === chat._id ? res.data : item))
        )
      );
    } catch (error) {
      console.error("Failed to update chat:", error);
      setChats((prev) =>
        sortChats(
          prev.map((item) =>
            item._id === chat._id ? { ...item, [key]: !next } : item
          )
        )
      );
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this chat?"
    );

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

  const query = searchQuery.trim().toLowerCase();
  const filteredChats = chats.filter((chat) =>
    (chat.title || "").toLowerCase().includes(query)
  );
  const activeChats = filteredChats.filter((chat) => !chat.archived);
  const archivedChats = filteredChats.filter((chat) => chat.archived);

  const renderChat = (chat: Chat) => (
    <div key={chat._id} className="group relative">
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
          <button
            type="submit"
            className="rounded-md px-2 py-1 text-xs hover:bg-sidebar-accent"
          >
            Save
          </button>
        </form>
      ) : (
        <div className="flex items-center rounded-lg transition-colors hover:bg-sidebar-accent">
          <Link
            href={`/chat/${chat._id}`}
            prefetch={false}
            className="min-w-0 flex-1 px-2 py-1.5"
          >
            <div className="flex items-center gap-1.5">
              {chat.pinned ? (
                <Pin className="h-3 w-3 shrink-0 fill-current" />
              ) : null}
              {chat.favorite ? (
                <Star className="h-3 w-3 shrink-0 fill-current" />
              ) : null}
              <p className="truncate text-sm">{chat.title}</p>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {formatRelative(chat.updatedAt)}
            </p>
          </Link>

          <div className="absolute right-1 top-1 flex items-center gap-0.5 rounded-md bg-sidebar-accent px-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <button
              type="button"
              onClick={(e) => handleToggleFlag(e, chat, "favorite")}
              className="rounded-md p-1 text-muted-foreground hover:bg-sidebar hover:text-foreground"
              title={chat.favorite ? "Remove favorite" : "Favorite"}
            >
              <Star
                className={`h-3.5 w-3.5 ${chat.favorite ? "fill-current" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={(e) => handleToggleFlag(e, chat, "pinned")}
              className="rounded-md p-1 text-muted-foreground hover:bg-sidebar hover:text-foreground"
              title={chat.pinned ? "Unpin" : "Pin"}
            >
              <Pin
                className={`h-3.5 w-3.5 ${chat.pinned ? "fill-current" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={(e) => handleStartRename(e, chat)}
              className="rounded-md p-1 text-muted-foreground hover:bg-sidebar hover:text-foreground"
              title="Rename"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => handleToggleFlag(e, chat, "archived")}
              className="rounded-md p-1 text-muted-foreground hover:bg-sidebar hover:text-foreground"
              title={chat.archived ? "Unarchive" : "Archive"}
            >
              {chat.archived ? (
                <ArchiveRestore className="h-3.5 w-3.5" />
              ) : (
                <Archive className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={(e) => handleDeleteChat(e, chat._id)}
              disabled={deletingChatId === chat._id}
              className="rounded-md p-1 text-muted-foreground hover:bg-sidebar hover:text-foreground disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center justify-between px-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-2 text-sm font-medium"
        >
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
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-sidebar-accent"
        >
          <Plus className="h-4 w-4" />
          <span>New chat</span>
        </button>
      </div>

      <div className="px-2 pb-2 pt-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-transparent py-1.5 pl-7 pr-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-0.5">
          {activeChats.map(renderChat)}
          {!activeChats.length && !archivedChats.length ? (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              {query ? "No chats found" : "No conversations yet"}
            </p>
          ) : null}
        </div>

        {archivedChats.length ? (
          <div className="mt-3 border-t border-border pt-2">
            <button
              type="button"
              onClick={() => setShowArchived((value) => !value)}
              className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-sidebar-accent"
            >
              <span>Archived ({archivedChats.length})</span>
              <span>{showArchived ? "Hide" : "Show"}</span>
            </button>
            {showArchived ? (
              <div className="mt-1 space-y-0.5">{archivedChats.map(renderChat)}</div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="border-t border-border p-2">
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-sidebar-accent"
        >
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
