"use client";

import ModelSelector from "./ModelSelector";

export default function ChatHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">

      <div className="flex items-center gap-3">

        {/* Mobile menu */}
        <button className="rounded-lg p-2 hover:bg-gray-100 md:hidden">
          ☰
        </button>

        <ModelSelector />

      </div>

      <div className="flex items-center gap-2">

        <button className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
          Share
        </button>

        <button className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
          ⋯
        </button>

      </div>

    </header>
  );
}