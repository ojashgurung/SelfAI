"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/chat";
import { Card } from "@/components/ui/card";
import { WidgetPromptProps } from "@/types/widget";
import { getIconComponent } from "@/lib/utils/icon-mapping";
import { RefreshCcw, Copy } from "lucide-react";

interface WidgetChatBodyProps {
  messages: ChatMessage[];
  isLoading: boolean;
  setInputMessage: (value: string) => void;
  color: string;
  theme: "light" | "dark";
  title?: string;
  subTitle?: string;
  selectedPrompts?: WidgetPromptProps[];
}

export function WidgetChatBody({
  messages,
  isLoading,
  title,
  subTitle,
  color,
  theme,
  setInputMessage,
  selectedPrompts,
}: WidgetChatBodyProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div
      className="lex-1 w-full h-full overflow-y-auto p-3 space-y-3 bg-gradient-to-t from-purple-50/90 to-white/0 scrollbar-thin scrollbar-thumb-rounded-md hover:scrollbar-thumb-gray-300 scrollbar-track-transparent"
      style={
        {
          backgroundImage: `linear-gradient(to top, ${color}1A, #ffffff00)`,
          "--scrollbar-thumb": `${color}2A`,
        } as React.CSSProperties
      }
    >
      {messages.length === 0 ? (
        <div className="space-y-2">
          <div className="text-center">
            <div
              className="inline-block mb-3  rounded-full px-4 py-1"
              style={{
                backgroundColor: `${color}1A`,
              }}
            >
              <h3
                className="text-lg font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${color}, ${color}dd)`,
                }}
              >
                👋 Welcome!
              </h3>
            </div>
            <div>
              <p className="text-base font-medium text-gray-700">
                {title || "Curious about my work or thoughts?"}
              </p>
              <p
                className="text-sm inline-block text-transparent bg-clip-text font-semibold"
                style={{
                  backgroundImage: `linear-gradient(to right, ${color}, ${color}dd)`,
                }}
              >
                {subTitle || "Let's chat about it"}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative text-center">
              <span className="bg-white px-2 text-sm text-gray-500">
                Quick prompts to get started
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {selectedPrompts?.map((prompt) => {
              const IconComponent = getIconComponent(prompt.icon);
              return (
                <Card
                  key={prompt.title}
                  onClick={() => setInputMessage(prompt.content)}
                  className="p-2 hover:bg-gray-50 cursor-pointer transition-colors bg-white/95 rounded-xl shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-2 xl:gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${color}2A`,
                      }}
                    >
                      <IconComponent
                        className="w-4 h-4"
                        style={{
                          color: color,
                        }}
                      />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {prompt.title}
                    </h3>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <div key={message.id}>
            {index === 0 && (
              <div className="text-center mb-4 relative">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className="w-full border-t"
                    style={{
                      borderColor: `${color}2A`,
                      boxShadow: `0 1px 2px ${color}0A`,
                    }}
                  />
                </div>
                <div className="relative">
                  <span className="bg-white px-2 text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            <div
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "user" ? (
                <div
                  className="max-w-[80%] rounded-lg p-3 text-base"
                  style={{
                    backgroundColor: color,
                    color: "#ffffff",
                  }}
                >
                  <div>{message.content}</div>
                </div>
              ) : (
                <div
                  className="max-w-[80%] rounded-lg p-3 text-base bg-white shadow-sm"
                  style={{
                    backgroundColor: `${color}1A`,
                    color: "#1f2937",
                  }}
                >
                  <div>{message.content}</div>
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2">
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() => {
                        /* Add refresh handler */
                      }}
                    >
                      <RefreshCcw className="w-3 h-3" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() =>
                        navigator.clipboard.writeText(message.content)
                      }
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
