"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/types/chat";
import { WidgetChatHeader } from "./widget-chat-header";
import { WidgetChatInbox } from "./widget-chat-inbox";
import { WidgetChatBody } from "./widget-chat-body";
import { WidgetMinimizedPage } from "./widget-minimized";
import { useEmbeddedWidgetStore } from "@/context/use-embedded-widget-context";

export function ChatWidget() {
  const { theme, color, heading, title, subTitle, selectedPrompts } =
    useEmbeddedWidgetStore();
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    // TODO: Add message sending logic
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
