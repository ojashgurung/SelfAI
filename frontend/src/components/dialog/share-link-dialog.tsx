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
import { useAuth } from "@/hooks/use-auth";

interface ShareLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (shareToken: string) => void;
}

export function ShareLinkDialog({
  isOpen,
  onClose,
  onJoin,
}: ShareLinkDialogProps) {
  const { getAuthHeader } = useAuth();
  const [shareToken, setShareToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = shareToken.includes("/chat/public/")
      ? shareToken.split("/chat/public/")[1]
      : shareToken;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/public/${token}`,
        {
          // Include cookies for authentication
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please login to join this chat");
        }
        if (response.status === 404) {
          throw new Error("Invalid share token or chat not found");
        }
        throw new Error("Failed to join chat");
      }

      onJoin(token);
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!shareToken.trim() || isLoading}>
              {isLoading ? "Joining..." : "Join Chat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
