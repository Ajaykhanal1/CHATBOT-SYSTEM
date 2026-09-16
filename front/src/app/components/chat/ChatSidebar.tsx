"use client";

import Link from "next/link";

const chats = [
  {
    id: "1",
    title: "Learn React",
  },
  {
    id: "2",
    title: "Build MERN Project",
  },
  {
    id: "3",
    title: "Explain JavaScript",
  },
  {
    id: "4",
    title: "BCA Exam Preparation",
  },
];

export default function ChatSidebar() {
  return (
    <aside className="hidden w-72 flex-col border-r bg-gray-50 md:flex">

      {/* Logo */}
      <div className="flex h-16 items-center border-b px-5">
        <Link href="/" className="text-xl font-bold">
          MyChat
        </Link>
      </div>

      {/* New Chat */}
      <div className="p-4">
        <Link
          href="/chat"
          className="flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + New Chat
        </Link>
      </div>

      {/* Search */}
      <div className="px-4">
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
        />
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 py-5">

        <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Recent
        </p>

        <div className="space-y-1">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className="block truncate rounded-xl px-3 py-3 text-sm text-gray-600 transition hover:bg-gray-200 hover:text-black"
            >
              {chat.title}
            </Link>
          ))}
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t p-4">

        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl p-2 hover:bg-gray-200"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm text-white">
            A
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              Ajay
            </p>

            <p className="truncate text-xs text-gray-500">
              Free Plan
            </p>
          </div>
        </Link>

      </div>

    </aside>
  );
}