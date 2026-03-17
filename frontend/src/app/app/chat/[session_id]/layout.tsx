import { ChatSidebarProvider } from "@/context/chat-sidebar-context";

export default function ChatPage({ children }: { children: React.ReactNode }) {
  return <ChatSidebarProvider>{children}</ChatSidebarProvider>;
}
