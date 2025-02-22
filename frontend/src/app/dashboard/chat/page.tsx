import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";

const prompts = [
  {
    title: "Write a to-do list for a personal project or task",
    icon: "👤",
  },
  {
    title: "Generate an email to reply to a job offer",
    icon: "✉️",
  },
  {
    title: "Summarise this article or text for me in one paragraph",
    icon: "📄",
  },
  {
    title: "How does AI work in a technical capacity",
    icon: "🤖",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Hi there, <span className="text-purple-600">John</span>
        </h1>
        <h2 className="text-2xl">
          What <span className="text-purple-700">would like to know?</span>
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Use one of the most common prompts below or use your own to begin
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {prompts.map((prompt) => (
          <Card
            key={prompt.title}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{prompt.icon}</span>
              <p className="text-sm">{prompt.title}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" className="text-gray-500">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refresh Prompts
        </Button>
      </div>

      <Card className="p-4">
        <textarea
          placeholder="Ask whatever you want...."
          className="w-full h-24 resize-none border-0 focus:ring-0 p-0 text-base placeholder:text-gray-400"
        />
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Add Attachment
            </Button>
            <Button variant="outline" size="sm">
              Use Image
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">0/1000</span>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
