"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ChatMessage } from "@/types/chat";
import { useChatSidebar } from "@/context/chat-sidebar-context";

import ChatInbox from "@/components/chat/chat-inbox";
import ChatBody from "@/components/chat/chat-body";
import ChatHeader from "@/components/chat/chat-header";
import ChatInfoSidebar from "@/components/chat/chat-info-sidebar";

export default function ChatPage() {
  const { isChatSidebarOpen } = useChatSidebar();
  const { getAuthHeader } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          body: JSON.stringify({ content: inputMessage }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      const aiResponse = await response.json();
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex h-full relative overflow-hidden">
      <div
        className={`flex flex-col transition-all duration-300 ${!isChatSidebarOpen ? "w-full" : "w-[70%]"}`}
        style={{
          background:
            "linear-gradient(to top, rgba(233, 235, 252, 0.9) 0%, rgba(255, 255, 255, 0) 50%)",
        }}
      >
        <div className="flex-none border-b border-gray-200">
          <ChatHeader isPublic={true} />
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 overscroll-none">
          <div className="h-full">
            <ChatBody messages={messages} isLoading={isLoading} />
          </div>
        </div>
        <div className="flex-none p-4">
          <ChatInbox
            inputMessage={inputMessage}
            isLoading={isLoading}
            onInputChange={setInputMessage}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
      <div
        className={`absolute right-0 top-0 bottom-0 w-[30%] border-l border-gray-200 bg-white transition-all duration-300 ease-in-out
        ${isChatSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <ChatInfoSidebar isPublic={true} />
      </div>
    </div>
  );
}
