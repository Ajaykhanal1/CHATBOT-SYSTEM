"use client";

import { Menu } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ModelSelector from "./ModelSelector";
import ChatSidebar from "./ChatSidebar";

export default function ChatHeader() {
  return (
    <header className="relative flex h-16 items-center justify-between border-b border-white/5 px-4 backdrop-blur-xl md:px-6">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="flex items-center gap-3">
        <Dialog>
          <DialogTrigger className="md:hidden">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </DialogTrigger>
          <DialogContent className="left-0 top-0 h-full w-72 translate-x-0 translate-y-0 border-r border-white/5 bg-background p-0">
            <ChatSidebar />
          </DialogContent>
        </Dialog>

        <ModelSelector />
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground sm:flex">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-accent" />
          <span>MyChat</span>
        </div>
      </div>
    </header>
  );
}