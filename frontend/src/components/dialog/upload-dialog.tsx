import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DocumentService } from "@/lib/service/document.service";
import { ChatService } from "@/lib/service/chat.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, HelpCircle, X, Loader2 } from "lucide-react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (response: { session_id: string }) => void;
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "training"
  >("idle");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<String>("");

  const handleFileChange = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds the limit of 5MB.");
      toast.error("File size exceeded", {
        description:
          "File size exceeded. Please upload a file of size less than 5MB.",
      });
      setInterval(() => {
        setError("");
      }, 3000);
      return;
    }
    setUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      setUploadStatus("uploading");
      toast.info("Uploading your document...", {
        description:
          "This may take a few moments. Please don’t close the page.",
      });

      await DocumentService.uploadDocument(uploadedFile);

      setUploadStatus("training");
      toast.info("Document uploaded and Training started!", {
        description: "Hang tight — we’re preparing your AI now.",
      });

      setUploadedFile(null);
      const masterSession = await ChatService.getMasterSession();

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (masterSession) {
        onOpenChange(false);
        toast.info("Training complete and Redirecting to chat!", {
          description:
            "Your document is now ready to chat with. Redirecting...",
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.href = `/dashboard/chat/${masterSession?.id}`;
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed", {
        description: "Something went wrong. Please try uploading again.",
      });
      toast.error("Training failed", {
        description: "We couldn’t train your document. Please retry shortly.",
      });
    } finally {
      setUploadStatus("idle");
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center">
            <DialogTitle>Upload file</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 bg-blue-50/50">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-2 rounded-full bg-blue-100">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.docx,.md"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(file);
                }}
              />
              <label htmlFor="file-upload" className="text-sm text-center">
                Drag and Drop file here or{" "}
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Choose file
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>Supported formats: PDF, DOCX, MD</span>
            <span>Maximum size: 5MB</span>
          </div>
          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          {/* Show file that is going to be uploaded just to make user sure about it */}
          {uploadedFile && (
            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3 border border-blue-100">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Download className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{uploadedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-red-500"
                onClick={() => setUploadedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" className="text-gray-500 gap-1">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </Button>
            <div className="space-x-2">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                size="sm"
                onClick={handleUpload}
                disabled={!uploadedFile || isUploading}
              >
                {(uploadStatus === "uploading" ||
                  uploadStatus === "training") && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {uploadStatus === "uploading"
                  ? "Uploading..."
                  : uploadStatus === "training"
                    ? "Training..."
                    : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
