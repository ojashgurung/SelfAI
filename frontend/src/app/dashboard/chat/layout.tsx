import ChatBody from "@/components/chat/chat-body";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInfoSidebar } from "@/components/chat/chat-info-sidebar";
import { ChatSidebarProvider } from "@/context/chat-sidebar-context";

export default function ChatPage({ children }: { children: React.ReactNode }) {
  return <ChatSidebarProvider>{children}</ChatSidebarProvider>;
}
