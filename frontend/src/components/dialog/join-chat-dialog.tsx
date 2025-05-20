import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { ChatService } from "@/lib/service/chat.service";
import { Loader2 } from "lucide-react";

interface ShareLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinChatDialog({ isOpen, onClose }: ShareLinkDialogProps) {
  const [shareToken, setShareToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to join chat"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Chat via Share Link</DialogTitle>
          <DialogDescription>
            Enter the share token to join an existing chat session.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="shareToken"
                placeholder="Enter share token..."
                className="col-span-4"
                value={shareToken}
                onChange={(e) => setShareToken(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              type="submit"
              disabled={!shareToken.trim() || isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading ? "Joining..." : "Join Chat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
