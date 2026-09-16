import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessages from "../components/chat/ChatMessages";
import ChatInput from "../components/chat/ChatInput";

export default function ChatPage() {
  return (
    <main className="flex h-screen overflow-hidden bg-white text-black">

      {/* Sidebar */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <section className="flex min-w-0 flex-1 flex-col">

        <ChatHeader />

        <ChatMessages />

        <ChatInput />

      </section>

    </main>
  );
}