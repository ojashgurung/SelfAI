"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils/utils";
import { ConnectGithubDialog } from "@/components/dialog/connect-github-dialog";
import { X, Loader2 } from "lucide-react";
import { SOURCE_CONFIG, SIDEBAR_SOURCES } from "./utils/source-config";
import { toast } from "sonner";

interface IntegrationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  connectedPlatforms: string[];
  onConnectionAdded: () => void;
}

export default function IntegrationsSidebar({
  isOpen,
  onClose,
  connectedPlatforms = [],
  onConnectionAdded,
}: IntegrationsSidebarProps) {
  const [showGithubDialog, setShowGithubDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSourceClick = (id: string) => {
    if (id === "github") {
      setShowGithubDialog(true);
    } else if (id === "documents") {
      fileInputRef.current?.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum size is 5MB" });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/graph/integrations/documents/upload`,
        { method: "POST", credentials: "include", body: formData },
      );

      if (!response.ok) throw new Error("Upload failed");

      toast.success(`${file.name} uploaded and ingested`);
      onConnectionAdded();
      onClose();
    } catch (error) {
      toast.error("Upload failed", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="absolute inset-0 z-20 bg-black/10 backdrop-blur-[1px]"
          onClick={onClose}
        />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.md,.html,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Drawer */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 z-30 w-72 bg-white border-r border-gray-100 shadow-xl flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-900">Add Source</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Connect a data source to your identity
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sources list */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              <p className="text-xs text-gray-400">
                Uploading and ingesting...
              </p>
            </div>
          ) : (
            SIDEBAR_SOURCES.map((source) => {
              const config = SOURCE_CONFIG[source.id];
              const Icon = config?.icon;
              const isConnected = connectedPlatforms.includes(source.id);
              // Documents can always be clicked even if connected (to add more files)
              const isClickable =
                source.available && (source.id === "documents" || !isConnected);

              return (
                <button
                  key={source.id}
                  onClick={() => isClickable && handleSourceClick(source.id)}
                  disabled={!isClickable}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150",
                    isClickable
                      ? "hover:bg-gray-50 cursor-pointer"
                      : "cursor-not-allowed opacity-40",
                  )}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: config?.bg || "#f5f5f5" }}
                  >
                    {Icon && (
                      <Icon
                        className="w-5 h-5"
                        style={{ color: config?.color }}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {source.title}
                    </p>
                    <p className="text-xs text-gray-400">{source.subtitle}</p>
                  </div>

                  {/* Badge */}
                  <div className="flex-shrink-0">
                    {isConnected && source.id !== "documents" ? (
                      <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Connected
                      </span>
                    ) : source.comingSoon ? (
                      <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        Soon
                      </span>
                    ) : source.id === "documents" && isConnected ? (
                      <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        Add more
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        Connect
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 text-center">
            More integrations coming soon
          </p>
        </div>
      </div>

      {/* GitHub Dialog */}
      <ConnectGithubDialog
        isOpen={showGithubDialog}
        onClose={() => {
          setShowGithubDialog(false);
          onConnectionAdded();
        }}
      />
    </>
  );
}
