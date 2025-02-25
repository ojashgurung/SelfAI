import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, HelpCircle, X } from "lucide-react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const handleFileChange = (file: File) => {
    if (file.size > 25 * 1024 * 1024) {
      // 25MB limit
      return;
    }
    setUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
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
            <span>Maximum size: 25MB</span>
          </div>

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
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button size="sm">Next</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
