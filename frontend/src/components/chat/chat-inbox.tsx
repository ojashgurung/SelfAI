"use client";

import { useState } from "react";

import { ArrowUp, Sparkle } from "lucide-react";

interface ChatInboxProps {
  inputMessage: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export default function ChatInbox({
  inputMessage,
  isLoading,
  onInputChange,
  onSendMessage,
}: ChatInboxProps) {
  const [showPrompts, setShowPrompts] = useState(false);

  const handlePromptClick = (prompt: string) => {
    onInputChange(prompt);
    setShowPrompts(false);
  };

  const popularPrompts = [
    "What professional skills do you have?",
    "Tell me about a recent project you've completed.",
    "What are some of your personal interests or hobbies?",
    "What career goals are you currently working towards?",
  ];

  return (
    <div className="max-w-3xl mx-auto relative">
      <button
        className="absolute flex gap-2 items-center left-8 bottom-full bg-indigo-600 px-4 py-2 rounded-t-xl text-sm text-white hover:bg-indigo-700"
        onClick={() => setShowPrompts(!showPrompts)}
        aria-expanded={showPrompts}
        aria-haspopup="true"
      >
        <Sparkle className="w-4 h-4" />
        Popular prompts {showPrompts ? "↓" : "↑"}
      </button>
      <div className="absolute -top-36 w-full">
        {showPrompts && (
          <div className="bg-white rounded-lg shadow-lg p-3 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {popularPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="text-left p-2 text-sm hover:bg-indigo-50 rounded-md transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-100 shadow-lg p-2">
        <input
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
          type="text"
          placeholder="Ask SelfAI anything about me..."
          className="flex-1 ml-4 resize-none border-none outline-none bg-transparent focus:ring-0 text-base placeholder:text-gray-400"
        />
        <button
          onClick={onSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="flex items-center justify-center w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full text-base cursor-pointer"
        >
          <ArrowUp className="w-6 h-6 text-purple-100" />
        </button>
      </div>
    </div>
  );
}
