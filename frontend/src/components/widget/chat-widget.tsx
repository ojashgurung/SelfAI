"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Send,
  GraduationCap,
  Mail,
  FileCode,
} from "lucide-react";
import { ChatMessage } from "@/types/chat";

interface WidgetChatProps {
  sessionId: string;
  theme?: "light" | "dark";
}

const widgetPrompts = [
  {
    title: "Education & Graduation",
    content: "Where does he study right now and when does he graduate?",
    icon: GraduationCap,
  },
  {
    title: "Contact Info",
    content: "Can I get his portfolio website link and also his email?",
    icon: Mail,
  },
  {
    title: "Python Projects",
    content: "Can you show me some of his Python projects?",
    icon: FileCode,
  },
];

export function ChatWidget({ sessionId }: WidgetChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    // TODO: Add message sending logic
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-4">
      {isOpen ? (
        <Card className="w-[300px] h-[450px] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
          {/* Compact Header */}
          <div className="p-3 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-purple-600" />
              </div>
              <span className="text-sm font-medium">Chat with AI</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Compact Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-t from-purple-50/90 to-white/0">
            {messages.length === 0 ? (
              <div className="space-y-2">
                <div className="text-center">
                  <div className="inline-block mb-3 bg-purple-100 rounded-full px-4 py-1">
                    <h3 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                      👋 Welcome!
                    </h3>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Curious about my work or thoughts?
                    </p>
                    <p className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 inline-block text-transparent bg-clip-text font-semibold">
                      Let's chat about it
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative text-center">
                    <span className="bg-white px-2 text-xs text-gray-500">
                      Quick prompts to get started
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {widgetPrompts.map((prompt) => (
                    <Card
                      key={prompt.title}
                      onClick={() => setInputMessage(prompt.content)}
                      className="p-2 hover:bg-purple-50 cursor-pointer transition-colors bg-white/95 rounded-xl shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-200 rounded-lg flex items-center justify-center">
                          <prompt.icon className="w-3 h-3 text-purple-600" />
                        </div>
                        <h3 className="text-xs font-medium text-gray-900">
                          {prompt.title}
                        </h3>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-2 text-xs ${
                      message.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Compact Input Area */}
          <div className="border-t p-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 text-sm p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-1.5 text-center border-t bg-gray-50">
            <p className="text-[10px] text-gray-500">Powered by SelfAI</p>
          </div>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 bg-purple-600 text-white shadow-lg hover:bg-purple-700"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
