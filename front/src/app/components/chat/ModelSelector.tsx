"use client";

import { useState } from "react";

const models = [
  "GPT",
  "Claude",
  "Gemini",
  "DeepSeek",
];

export default function ModelSelector() {
  const [model, setModel] = useState("GPT");
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl px-3 py-2 font-medium hover:bg-gray-100"
      >
        {model}
        <span className="text-xs">⌄</span>
      </button>

      {open && (
        <div className="absolute left-0 top-12 z-50 w-48 rounded-xl border bg-white p-2 shadow-xl">

          {models.map((item) => (
            <button
              key={item}
              onClick={() => {
                setModel(item);
                setOpen(false);
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              {item}
            </button>
          ))}

        </div>
      )}

    </div>
  );
}