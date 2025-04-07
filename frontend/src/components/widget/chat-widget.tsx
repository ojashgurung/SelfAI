"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/types/chat";
import { WidgetChatHeader } from "./widget-chat-header";
import { WidgetChatInbox } from "./widget-chat-inbox";
import { WidgetChatBody } from "./widget-chat-body";
import { WidgetMinimizedPage } from "./widget-minimized";
import { useWidgetStore } from "@/context/use-widget-context";

export function ChatWidget() {
  const store = useWidgetStore();
  const { theme, color, heading, title, subTitle, selectedPrompts } = store;
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
        <Card className="2xl:h-[600px] 2xl:w-[400px] xl:h-[560px] w-[360px]  bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
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
