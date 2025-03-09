"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChatSession } from "@/types/chat";

import ChatBody from "@/components/chat/chat-body";
import ChatHeader from "@/components/chat/chat-header";
import ChatInfoSidebar from "@/components/chat/chat-info-sidebar";
import { useChatSidebar } from "@/context/chat-sidebar-context";

export default function PublicChatPage() {
  const { token } = useParams();
  const { isChatSidebarOpen } = useChatSidebar();
  // const [session, setSession] = useState<ChatSession | null>(null);
  const session = {
    id: "123",
    title: "Public Chat Demo",
    namespace: "demo",
    is_public: true,
    share_token: token as string,
    messages: [],
  };

  // useEffect(() => {
  //   const fetchSession = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/public/${token}`
  //       );
  //       if (!response.ok) throw new Error("Session not found");
  //       const data = await response.json();
  //       setSession(data);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   fetchSession();
  // }, [token]);

  if (!session) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <div
        className={`flex flex-col transition-all duration-300 ${!isChatSidebarOpen ? "w-full" : "w-[70%]"}`}
      >
        <div className="border-b border-gray-200">
          <ChatHeader isPublic={true} session={session} />
        </div>
        <div className="flex-1 flex overflow-y-auto">
          <ChatBody isPublic={true} session={session} />
        </div>
      </div>
      <div
        className={`absolute right-0 top-0 bottom-0 w-[30%] border-l border-gray-200 bg-white transition-all duration-300 ease-in-out
        ${isChatSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <ChatInfoSidebar isPublic={true} session={session} />
      </div>
    </div>
  );
}
