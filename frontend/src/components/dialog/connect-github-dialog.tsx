import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { integrationService } from "@/lib/service/integration.service";
import { toast } from "sonner";

interface ConnectGithubDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectGithubDialog({
  isOpen,
  onClose,
}: ConnectGithubDialogProps) {
  const handleConnect = async () => {
    try {
      // Redirect to GitHub OAuth
      const authUrl = integrationService.getGithubAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Failed to initiate GitHub connection:", error);
      toast.error("Failed to connect to GitHub");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect GitHub</DialogTitle>
          <DialogDescription>
            Are you sure you want to connect GitHub? This will import your
            repositories and commit history to build your identity context.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConnect} className="bg-black text-white hover:bg-gray-800">
            Yes, Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}