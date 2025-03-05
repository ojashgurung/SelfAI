import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  RefreshCcw,
  GraduationCap,
  Mail,
  FileCode,
  Copy,
  SquareArrowOutUpRight,
  ArrowUp,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const prompts = [
  {
    title: "Where does he study right now and when does he graduate?",
    icon: GraduationCap,
  },
  {
    title: "Can I get his portfolio website link and also his email?",
    icon: Mail,
  },
  {
    title:
      "Is he proficient in Python? And does he have any recent project in it?",
    icon: FileCode,
  },
];

const useTypewriter = (text: string, speed: number = 40) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    setIsTyping(true);
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isTyping };
};

export default function ChatBody() {
  const response =
    "He is currently studying at Monroe University, and he graduates in 2026.";
  const { displayedText, isTyping } = useTypewriter(response);
  const hasChat = true;
  return (
    <div
      className="relative flex-1 flex flex-col overflow-hidden justify-between"
      style={{
        background:
          "linear-gradient(to top, rgba(233, 235, 252, 0.9) 0%, rgba(255, 255, 255, 0) 50%)",
      }}
    >
      <div className="flex-1 overflow-y-auto">
        {hasChat !== undefined ? (
          <div className="overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4">
              {/* Timestamp */}
              <div className="text-center my-4 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative">
                  <span className="bg-white px-4 text-xs text-gray-500">
                    Today 2:45 PM
                  </span>
                </div>
              </div>

              {/* User Message */}
              <div className="flex items-start gap-3 mb-6">
                <Avatar>
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center rounded-full">
                    <span className="text-indigo-600 font-medium text-sm">
                      MD
                    </span>
                  </div>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">MS Dhoni</span>
                    <span className="text-sm text-gray-500">2:45 PM</span>
                  </div>
                  <p className="text-gray-700">
                    Hey, can you explain how the model determines token usage
                    and tracks interactions?
                  </p>
                </div>
              </div>

              {/* AI Response */}
              <Card className="p-4 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] border hover:border-purple-200 transition rounded-xl mb-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center rounded-full">
                      <span className="text-indigo-600 font-medium text-sm">
                        AI
                      </span>
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">SelfAI</span>
                      <span className="text-sm text-gray-500">2:46 PM</span>
                    </div>
                    <div>
                      <p className="text-gray-700 mb-2">
                        {displayedText}
                        {isTyping && <span className="animate-pulse">▋</span>}
                      </p>
                      <div className="flex items-center justify-between border-t pt-3">
                        {!isTyping && (
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm">
                              <RefreshCcw className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <SquareArrowOutUpRight className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        {!isTyping && (
                          <span className="text-sm text-gray-500">
                            32 tokens
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Gradient fade at bottom */}
              <div className="h-32 bg-gradient-to-t from-white to-transparent pointer-events-none fixed bottom-0 left-0 right-0" />
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="max-w-3xl mx-auto p-8 mt-10">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  Hi there, <span className="text-purple-600">John</span>
                </h1>
                <h2 className="text-2xl">
                  What{" "}
                  <span className="text-purple-700">would like to knows?</span>
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                  Use one of the most common prompts below or use your own to
                  begin
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 max-w-2xl max-h-lg">
                {prompts.map((prompt) => (
                  <Card
                    key={prompt.title}
                    className="p-6 hover:bg-purple-50 cursor-pointer transition-colors bg-white/95 rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 bg-purple-200 rounded-2xl flex items-center justify-center">
                        <span className="text-base text-white">
                          <prompt.icon className="w-5 h-5 text-purple-600" />
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1 text-sm">
                          {prompt.title}
                        </h3>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input - Always visible */}
      <div className="sticky bottom-0 left-0 right-0 p-4 mt-auto shadow-2xl">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 bg-white rounded-full border shadow-sm p-2">
            <input
              type="text"
              placeholder="Ask SelfAI anything about me..."
              className="flex-1 ml-4 resize-none border-none outline-none bg-transparent focus:ring-0 text-base placeholder:text-gray-400"
            />
            <div className="flex items-center justify-center w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full text-base cursor-pointer">
              <ArrowUp className="w-6 h-6 text-purple-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
