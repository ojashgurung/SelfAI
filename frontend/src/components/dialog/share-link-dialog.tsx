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
  const [shareToken, setShareToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJoin(shareToken);
    setShareToken("");
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
            <Button type="submit" disabled={!shareToken.trim()}>
              Join Chat
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
