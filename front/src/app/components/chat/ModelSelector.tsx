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
        className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground backdrop-blur transition-all hover:border-white/20"
      >
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-accent" />
        <span>{selected.name}</span>
        <span className="hidden text-xs text-muted-foreground sm:inline">· {selected.tag}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-y-0.5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-12 z-50 w-64 overflow-hidden rounded-3xl border border-white/10 bg-background/90 p-2 shadow-2xl shadow-primary/10 backdrop-blur-xl">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Choose model
            </p>
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelected(model);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition-colors hover:bg-white/5"
              >
                <div>
                  <p className="text-foreground">{model.name}</p>
                  <p className="text-xs text-muted-foreground">{model.tag}</p>
                </div>
                {selected.id === model.id && (
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-accent" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}