"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const models = [
  { id: "gpt", name: "GPT-4o", tag: "General" },
  { id: "claude", name: "Claude Sonnet", tag: "Writing" },
  { id: "gemini", name: "Gemini 2.5", tag: "Multimodal" },
  { id: "deepseek", name: "DeepSeek V3", tag: "Coding" },
];

export default function ModelSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(models[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
      >
        <span>{selected.name}</span>
        <span className="text-muted-foreground">· {selected.tag}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-9 z-50 w-56 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-md">
            <p className="px-2 py-1.5 text-xs text-muted-foreground">Choose model</p>
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelected(model);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
              >
                <div>
                  <p>{model.name}</p>
                  <p className="text-xs text-muted-foreground">{model.tag}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}