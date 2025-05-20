import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ChatService } from "@/lib/service/chat.service";

export function ConnectChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [shareToken, setShareToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = shareToken.includes("/chat/public/")
      ? shareToken.split("/chat/public/")[1]
      : shareToken;
    setIsLoading(true);
    try {
      const response = await ChatService.getJoinChatSession(token);
      toast.info("Joining Chat", {
        description:
          "This may take a few moments. Please don’t close the page.",
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.href = `/dashboard/chat/${response?.id}`;

      toast.info("Chat Joined now redirecting to chat!", {
        description:
          "Successfully joined chat is now ready to chat. Redirecting...",
      });
      setShareToken("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to join chat"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="p-6 bg-white rounded-3xl h-[280px] 2xl:h-[300px]">
      <div className="flex flex-col h-full">
        <div className="mb-4 2xl:mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Connect with a SelfAI
          </h2>
          <p className="text-base text-gray-600">
            Paste a SelfAI share link to chat with their profile.
          </p>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Paste SelfAI share link here..."
            className="w-full p-4 bg-gray-100 rounded-2xl text-gray-700 text-base outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setShareToken(e.target.value)}
          />
        </div>

        <Button
          className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-white text-base font-medium"
          disabled={!shareToken.trim() || isLoading}
          onClick={handleSubmit}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? "Joining..." : "Start Chatting"}
        </Button>
      </div>
    </Card>
  );
}
