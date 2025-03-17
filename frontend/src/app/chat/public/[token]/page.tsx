"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChatSession, ChatMessage } from "@/types/chat";

import ChatInbox from "@/components/chat/chat-inbox";
import ChatBody from "@/components/chat/chat-body";
import ChatHeader from "@/components/chat/chat-header";
import ChatInfoSidebar from "@/components/chat/chat-info-sidebar";
import { useChatSidebar } from "@/context/chat-sidebar-context";

export default function PublicChatPage() {
  const { token } = useParams();
  const { isChatSidebarOpen } = useChatSidebar();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Add message handling function
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !session?.id) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsSending(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/sessions/${session.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.share_token}`,
          },
          body: JSON.stringify({
            content: inputMessage,
            share_token: token,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to send message");

      const aiResponse = await response.json();
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      setError("Failed to send message");
      console.error("Error:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Update useEffect to initialize messages
  useEffect(() => {
    if (session?.messages) {
      setMessages(session.messages);
    }
  }, [session]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/public/${token}`
        );
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Chat session not found"
              : "Failed to load chat"
          );
        }
        const data = await response.json();
        console.log(data.namespace);
        if (data.user_id || data.namespace) {
          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${data.user_id || data.namespace}`
          );
          if (userResponse.ok) {
            const userData = await userResponse.json();
            data.owner = userData; // Add user data to session
          }
        }

        setSession(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong"
        );
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchSession();
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-gray-500">
          Loading chat session...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Session not found</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen relative overflow-hidden">
      <div
        className={`flex flex-col h-full transition-all duration-300 ${!isChatSidebarOpen ? "w-full" : "w-[70%]"}`}
        style={{
          background:
            "linear-gradient(to top, rgba(233, 235, 252, 0.9) 0%, rgba(255, 255, 255, 0) 50%)",
        }}
      >
        <div className="flex-none border-b border-gray-200">
          <ChatHeader isPublic={true} session={session} />
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 overscroll-none">
          <div className="h-full">
            <ChatBody isPublic={true} session={session} messages={messages} />
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
        <ChatInfoSidebar isPublic={true} session={session} />
      </div>
    </div>
  );
}
