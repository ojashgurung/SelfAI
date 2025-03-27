"use client";

import { ChatMessage } from "@/types/chat";

interface WidgetChatBodyProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function WidgetChatBody({ messages, isLoading }: WidgetChatBodyProps) {
  return (
    <div className="flex flex-col space-y-2 p-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`max-w-[80%] rounded-lg p-2 text-sm ${
            message.role === "user"
              ? "ml-auto bg-indigo-600 text-white"
              : "bg-gray-100"
          }`}
        >
          {message.content}
        </div>
      ))}
      {isLoading && (
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="animate-pulse">AI is typing...</div>
        </div>
      )}
    </div>
  );
}
