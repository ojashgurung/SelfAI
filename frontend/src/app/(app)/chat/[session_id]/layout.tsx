import { ChatSidebarProvider } from "@/context/chat-sidebar-context";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatSidebarProvider>{children}</ChatSidebarProvider>;
}
