"use client";

import { useChatSidebar } from "@/context/chat-sidebar-context";

import ChatBody from "@/components/chat/chat-body";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInfoSidebar } from "@/components/chat/chat-info-sidebar";

export default function ChatPage() {
  const { isChatSidebarOpen } = useChatSidebar();
  return (
    <div className="flex h-full relative">
      {/* Main Section */}
      <div
        className={`flex flex-col transition-all duration-300 ${!isChatSidebarOpen ? "w-full" : "w-[70%]"}`}
      >
        <div className="border-b border-gray-200">
          <ChatHeader />
        </div>
        <div className="flex-1 flex overflow-y-auto">
          <ChatBody />
        </div>
      </div>
      {/* Right Sidebar Section*/}
      <div
        className={`absolute right-0 top-0 bottom-0 w-[30%] border-l border-gray-200 bg-white transition-all duration-300 ease-in-out
        ${isChatSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <ChatInfoSidebar />
      </div>
    </div>
  );
}
