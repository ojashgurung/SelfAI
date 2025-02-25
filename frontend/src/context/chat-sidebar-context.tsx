"use client";

import { createContext, useContext, useState } from "react";

interface ChatSidebarContextType {
  isChatSidebarOpen: boolean;
  toggleChatSidebar: () => void;
}

const ChatSidebarContext = createContext<ChatSidebarContextType | undefined>(
  undefined
);

export function ChatSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(true);

  const toggleChatSidebar = () => setIsChatSidebarOpen(!isChatSidebarOpen);

  return (
    <ChatSidebarContext.Provider
      value={{ isChatSidebarOpen, toggleChatSidebar }}
    >
      {children}
    </ChatSidebarContext.Provider>
  );
}

export const useChatSidebar = () => {
  const context = useContext(ChatSidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider");
  return context;
};
