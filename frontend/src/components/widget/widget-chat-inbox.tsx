"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface WidgetChatInboxProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  theme?: "light" | "dark";
  color?: string;
}

export function WidgetChatInbox({
  color,
  theme,
  setInputMessage,
  handleSendMessage,
  inputMessage,
  isLoading,
}: WidgetChatInboxProps) {
  return (
    <div className="border-t p-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className={`flex-1 text-sm xl:text-base p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-${color}-500`}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="transition-all duration-300 ease-in-out hover:brightness-90"
          style={{ backgroundColor: color }}
        >
          <Send className="w-4 h-4 xl:w-5 xl:h-5" />
        </Button>
      </div>
    </div>
  );
}
