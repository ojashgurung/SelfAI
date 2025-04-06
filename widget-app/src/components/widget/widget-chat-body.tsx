"use client";

import { ChatMessage } from "@/types/chat";
import { Card } from "@/components/ui/card";
import { WidgetPromptProps } from "@/types/widget";
import { getIconComponent } from "@/lib/utils/icon-mapping";

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
  return (
    <div
      className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-t from-purple-50/90 to-white/0"
      style={{
        backgroundImage: `linear-gradient(to top, ${color}1A, #ffffff00)`,
      }}
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
                className="text-sm xl:text-lg font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${color}, ${color}dd)`,
                }}
              >
                👋 Welcome!
              </h3>
            </div>
            <div>
              <p className="text-sm xl:text-base font-medium text-gray-700">
                {title || "Curious about my work or thoughts?"}
              </p>
              <p
                className="text-xs xl:text-sm inline-block text-transparent bg-clip-text font-semibold"
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
              <span className="bg-white px-2 text-xs xl:text-sm text-gray-500">
                Quick prompts to get started
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 xl:gap-3">
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
                      className="w-6 h-6 xl:w-8 xl:h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${color}2A`,
                      }}
                    >
                      <IconComponent
                        className="w-3 h-3 xl:w-4 xl:h-4"
                        style={{
                          color: color,
                        }}
                      />
                    </div>
                    <h3 className="text-xs xl:text-sm font-medium text-gray-900">
                      {prompt.title}
                    </h3>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
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
  );
}
