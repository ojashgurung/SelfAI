import { ChatSidebarProvider } from "@/context/chat-sidebar-context";

export default function PublicChatPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatSidebarProvider>{children}</ChatSidebarProvider>;
}
