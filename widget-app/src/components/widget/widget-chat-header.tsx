"use client";

import { MessageSquare } from "lucide-react";

interface WidgetChatHeaderProps {
  setIsOpen: (isOpen: boolean) => void;
  color?: string;
  theme?: "light" | "dark";
  heading: string;
}

export function WidgetChatHeader({
  setIsOpen,
  color,
  theme,
  heading,
}: WidgetChatHeaderProps) {
  const handleClose = () => {
    window.parent.postMessage({ type: "minimize" }, "*");
    setIsOpen(false);
  };
  return (
    <div className="p-3 border-b flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: `${color}2A`,
          }}
        >
          <MessageSquare
            className="w-4 h-4"
            style={{
              color: color,
            }}
          />
        </div>
        <span className="text-lg font-medium">{heading || "Chat with AI"}</span>
      </div>
      <button
        onClick={handleClose}
        className="text-gray-500 hover:text-gray-700"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-6 h-6"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
