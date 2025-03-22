import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";
import { useState } from "react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  shareUrl,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Share with Friends</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Learning is more effective when you connect with friends!
          </p>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <input
              className="flex-1 px-3 py-2 text-sm border rounded-lg bg-gray-50"
              value={shareUrl}
              readOnly
            />
            <Button
              size="sm"
              onClick={handleCopy}
              className={copied ? "bg-green-600" : ""}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Scan QR Code</h3>
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/public/${shareUrl.split("/").pop()}/qr`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => {
              const qrUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/public/${shareUrl.split("/").pop()}/qr`;
              window.open(qrUrl, "_blank");
            }}
          >
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
