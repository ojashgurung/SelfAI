import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCcw, GraduationCap, Mail, FileCode } from "lucide-react";
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

export default function ChatBody() {
  const hasChat = false;
  return (
    <div
      className="relative flex flex-col h-full"
      style={{
        background:
          "linear-gradient(to top, rgba(233, 235, 252, 0.9) 0%, rgba(255, 255, 255, 0) 50%)",
      }}
    >
      <div className="flex-1 overflow-y-auto">
        {hasChat ? (
          <div className="h-full overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4">
              {/* Timestamp */}
              <div className="text-center my-4">
                <span className="text-sm text-gray-500">Today 2:45 PM</span>
              </div>

              {/* User Message */}
              <div className="flex items-start gap-3 mb-6">
                <Avatar>
                  <img src="/avatars/alex.jpg" alt="Alex" />
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Alex Ferguson</span>
                    <span className="text-sm text-gray-500">2:45 PM</span>
                  </div>
                  <p className="text-gray-700">
                    Hey, can you explain how the model determines token usage
                    and tracks interactions?
                  </p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex items-start gap-3 mb-6">
                <Avatar>
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center rounded-full">
                    <span className="text-indigo-600 font-medium text-sm">
                      AI
                    </span>
                  </div>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Ciphy.io</span>
                    <span className="text-sm text-gray-500">2:46 PM</span>
                  </div>
                  <Card className="p-4 bg-white">
                    <p className="text-gray-700 mb-4">
                      Sure! Our model counts tokens in both input and output,
                      including spaces and special characters. Each token
                      corresponds roughly to one word, depending on the language
                      and complexity of the sentence. For more detailed tracking
                      of your interactions, we use timestamps and session IDs to
                      ensure the most relevant responses.
                    </p>
                    <div className="flex items-center justify-between border-t pt-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <RefreshCcw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                        <Button variant="ghost" size="sm">
                          Copy
                        </Button>
                        <Button variant="ghost" size="sm">
                          Share
                        </Button>
                      </div>
                      <span className="text-sm text-gray-500">32 tokens</span>
                    </div>
                  </Card>
                </div>
              </div>

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
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 rounded-full py-4 px-6"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
