"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  // Rename state
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Delete state
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  // Load chats
  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await api.get("/chats");
        setChats(res.data);
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    };

    loadChats();
  }, []);

  // Check New Chat cooldown
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

  // Create New Chat
  const handleNewChat = async () => {
    if (creating || newChatDisabled) return;

    try {
      setCreating(true);

      const cooldownUntil = Date.now() + COOLDOWN;

      localStorage.setItem(
        COOLDOWN_KEY,
        cooldownUntil.toString()
      );

      setNewChatDisabled(true);

      const res = await api.post("/chats");

      const newChat = res.data;

      setChats((prev) => [newChat, ...prev]);

      router.push(`/chat/${newChat._id}`);
    } catch (error) {
      console.error("Failed to create chat:", error);

      localStorage.removeItem(COOLDOWN_KEY);
      setNewChatDisabled(false);
    } finally {
      setCreating(false);
    }
  };

  // Start Rename
  const handleStartRename = (
    e: React.MouseEvent,
    chat: Chat
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setEditingChatId(chat._id);
    setEditingTitle(chat.title);
  };

  // Save Rename
  const handleRename = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!editingChatId || !editingTitle.trim()) return;

    try {
      const res = await api.put(
        `/chats/${editingChatId}`,
        {
          title: editingTitle.trim(),
        }
      );

      const updatedChat = res.data;

      setChats((prev) =>
        prev.map((chat) =>
          chat._id === updatedChat._id
            ? updatedChat
            : chat
        )
      );

      setEditingChatId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("Failed to rename chat:", error);
    }
  };

  // Delete Chat
  const handleDeleteChat = async (
    e: React.MouseEvent,
    chatId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this chat?"
    );

    if (!confirmed) return;

    try {
      setDeletingChatId(chatId);

      await api.delete(`/chats/${chatId}`);

      setChats((prev) =>
        prev.filter((chat) => chat._id !== chatId)
      );

      // If currently inside deleted chat
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
    <aside className="hidden w-72 flex-col border-r bg-gray-500 md:flex">

      {/* Header */}
      <div className="flex h-16 items-center border-b px-5">
        <Link
          href="/"
          className="text-xl font-bold"
        >
          MyChat
        </Link>
      </div>

      {/* New Chat */}
      <div className="p-4">
        <button
          type="button"
          onClick={handleNewChat}
          disabled={creating || newChatDisabled}
          className="flex w-full justify-center rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating
            ? "Creating..."
            : newChatDisabled
              ? "New Chat (1 min)"
              : "+ New Chat"}
        </button>
      </div>

      {/* Search */}
      <div className="px-4">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none"
        />
      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-2 pb-3 text-xs font-semibold uppercase text-gray-400">
          Recent
        </p>

        <div className="space-y-1">
          {filteredChats.map((chat) => (
            <div
              key={chat._id}
              className="group relative"
            >
              {editingChatId === chat._id ? (
                // Rename Input
                <form
                  onSubmit={handleRename}
                  className="flex gap-1"
                >
                  <input
                    autoFocus
                    value={editingTitle}
                    onChange={(e) =>
                      setEditingTitle(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setEditingChatId(null);
                        setEditingTitle("");
                      }
                    }}
                    className="min-w-0 flex-1 rounded-lg border bg-white px-2 py-2 text-sm outline-none"
                  />

                  <button
                    type="submit"
                    className="rounded-lg bg-black px-2 text-xs text-white"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex items-center">
                  {/* Chat Link */}
                  <Link
                    href={`/chat/${chat._id}`}
                    className="min-w-0 flex-1 truncate rounded-xl px-3 py-3 text-sm hover:bg-gray-200"
                  >
                    {chat.title}
                  </Link>

                  {/* Actions */}
                  <div className="hidden gap-1 pr-1 group-hover:flex">

                    {/* Rename */}
                    <button
                      type="button"
                      onClick={(e) =>
                        handleStartRename(e, chat)
                      }
                      className="rounded-md px-2 py-1 text-xs hover:bg-gray-300"
                      title="Rename"
                    >
                      ✏️
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={(e) =>
                        handleDeleteChat(e, chat._id)
                      }
                      disabled={
                        deletingChatId === chat._id
                      }
                      className="rounded-md px-2 py-1 text-xs hover:bg-red-200"
                      title="Delete"
                    >
                      🗑️
                    </button>

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Profile */}
      <div className="border-t p-4">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl p-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm text-white">
            A
          </div>

          <div>
            <p className="text-sm font-medium">
              Ajay
            </p>

            <p className="text-xs text-gray-900">
              Free Plan
            </p>
          </div>
        </Link>
      </div>

    </aside>
  );
}