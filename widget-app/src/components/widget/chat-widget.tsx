"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/types/chat";
import { WidgetChatHeader } from "./widget-chat-header";
import { WidgetChatInbox } from "./widget-chat-inbox";
import { WidgetChatBody } from "./widget-chat-body";
import { WidgetMinimizedPage } from "./widget-minimized";
import { useEmbeddedWidgetStore } from "@/context/use-embedded-widget-context";
import { widgetService } from "@/lib/service/widget.service";

export function ChatWidget() {
  const {
    theme,
    color,
    heading,
    title,
    subTitle,
    selectedPrompts,
    shareToken,
  } = useEmbeddedWidgetStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true);
        const session = await widgetService.initializeSession(shareToken);
        setSessionId(session.id);
        setMessages(session.messages);
      } catch (error) {
        console.error("Failed to initialize session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (shareToken) {
      initSession();
    }
  }, [shareToken]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const messageContent = inputMessage.trim();
    const newMessage = {
      id: Date.now().toString(),
      content: messageContent,
      role: "user",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, { ...newMessage, role: "user" as const }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await widgetService.sendMessage(
        sessionId,
        messageContent,
        shareToken
      );
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen ? (
        <Card className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
          {/* Widget Header */}
          <WidgetChatHeader
            setIsOpen={setIsOpen}
            heading={heading}
            theme={theme}
            color={color}
          />

          {/* Widget Body */}
          <WidgetChatBody
            messages={messages}
            isLoading={isLoading}
            setInputMessage={setInputMessage}
            color={color}
            theme={theme}
            title={title}
            subTitle={subTitle}
            selectedPrompts={selectedPrompts}
          />

          {/* Widget Input */}
          <WidgetChatInbox
            color={color}
            theme={theme}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            inputMessage={inputMessage}
            isLoading={isLoading}
          />

          {/* Footer */}
          <div className="p-1.5 text-center border-t bg-gray-50">
            <p className="text-[10px] xl:text-[12px] text-gray-500">
              Powered by SelfAI
            </p>
          </div>
        </Card>
      ) : (
        // Minimized Widget
        <WidgetMinimizedPage
          setIsOpen={setIsOpen}
          color={color}
          theme={theme}
        />
      )}
    </>
  );
}
