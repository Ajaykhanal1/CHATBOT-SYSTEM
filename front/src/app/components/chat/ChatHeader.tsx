"use client";

import { Menu } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ModelSelector from "./ModelSelector";
import ChatSidebar from "./ChatSidebar";

export default function ChatHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-4">
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger className="md:hidden">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </DialogTrigger>
          <DialogContent className="left-0 top-0 h-[100dvh] w-[260px] translate-x-0 translate-y-0 rounded-none border-0 p-0">
            <ChatSidebar />
          </DialogContent>
        </Dialog>

        <ModelSelector />
      </div>
    </header>
  );
}