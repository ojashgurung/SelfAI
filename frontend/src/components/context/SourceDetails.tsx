"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/utils";
import { FaGithub } from "react-icons/fa";
import {
  FileText,
  RefreshCw,
  Settings,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  WifiOff,
} from "lucide-react";
import { SOURCE_CONFIG } from "./utils/source-config";
import { toast } from "sonner";

interface SourceDetailsProps {
  source: {
    id: string;
    connection_id: string;
    platform: string;
    display_name: string;
    status: string;
    account_id?: string;
    last_synced_at?: string;
    last_ingested_at?: string;
    last_error?: string;
    source_metadata?: Record<string, any>;
  };
  onDisconnected?: () => void;
  onDeleted?: () => void;
}

const DATA_SCOPE: Record<string, string[]> = {
  github: ["Commit history", "PR discussions", "Documentation", "README files"],
  documents: ["PDF content", "DOCX files", "Markdown files"],
};

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

type ConfirmAction = "disconnect" | "delete" | null;

export default function SourceDetails({
  source,
  onDisconnected,
  onDeleted,
}: SourceDetailsProps) {
  if (!source) return null;

  const [isSyncing, setIsSyncing] = useState(false);
  const [isActioning, setIsActioning] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const config = SOURCE_CONFIG[source.platform];
  const Icon = config?.icon || FileText;
  const isIngested = !!source.last_ingested_at;
  const dataScope = DATA_SCOPE[source.platform] || [];

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/graph/sources/${source.id}/ingest`,
        { method: "POST", credentials: "include" },
      );
      if (!response.ok) throw new Error("Sync failed");
      toast.success("Sync started successfully");
    } catch (error) {
      toast.error("Failed to start sync");
    } finally {
      setTimeout(() => setIsSyncing(false), 2000);
    }
  };

  const handleDisconnect = async () => {
    setIsActioning(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/graph/sources/${source.id}/reset`,
        { method: "POST", credentials: "include" },
      );
      if (!response.ok) throw new Error("Disconnect failed");
      toast.success("Source disconnected — data cleared");
      setConfirmAction(null);
      onDisconnected?.();
    } catch (error) {
      toast.error("Failed to disconnect source");
    } finally {
      setIsActioning(false);
    }
  };

  const handleDelete = async () => {
    setIsActioning(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/graph/connections/${source.connection_id}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!response.ok) throw new Error("Delete failed");
      toast.success("Source deleted completely");
      setConfirmAction(null);
      onDeleted?.();
    } catch (error) {
      toast.error("Failed to delete source");
    } finally {
      setIsActioning(false);
    }
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: config?.bg || "#f5f5f5" }}
        >
          <Icon
            style={{ width: 22, height: 22, color: config?.color || "#6b7280" }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              {source.display_name}
            </h2>
            <span
              className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0",
                isIngested
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-amber-50 text-amber-600 border border-amber-200",
              )}
            >
              {isIngested ? "Ingested" : "Connected"}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            @{source.account_id || "—"}
          </p>
        </div>
      </div>

      {/* Sync button */}
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 mb-5"
      >
        <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
        {isSyncing ? "Syncing..." : "Refresh & Re-ingest"}
      </button>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            Last Sync
          </p>
          <p className="text-xs font-semibold text-gray-900">
            {timeAgo(source.last_synced_at)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            Last Ingested
          </p>
          <p className="text-xs font-semibold text-gray-900">
            {timeAgo(source.last_ingested_at)}
          </p>
        </div>
      </div>

      {/* Data scope */}
      {dataScope.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2">
            Data Scope
          </p>
          <div className="space-y-1.5">
            {dataScope.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span className="text-xs text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {source.last_error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 mb-5">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600">{source.last_error}</p>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-4" />

      {/* Actions */}
      {confirmAction === null ? (
        <div className="space-y-2">
          <button
            onClick={() => setConfirmAction("disconnect")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200"
          >
            <WifiOff className="w-3.5 h-3.5" />
            Disconnect source
            <span className="ml-auto text-amber-400 font-normal">
              Keeps connection
            </span>
          </button>
          <button
            onClick={() => setConfirmAction("delete")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete completely
            <span className="ml-auto text-red-400 font-normal">
              Irreversible
            </span>
          </button>
        </div>
      ) : confirmAction === "disconnect" ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-800 mb-1">
            Disconnect this source?
          </p>
          <p className="text-xs text-amber-600 mb-3">
            This will clear all ingested vectors and documents. Your connection
            stays — you can re-ingest anytime.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmAction(null)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDisconnect}
              disabled={isActioning}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {isActioning ? "Disconnecting..." : "Yes, disconnect"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-800 mb-1">
            Delete this source completely?
          </p>
          <p className="text-xs text-red-600 mb-3">
            This will permanently delete all vectors, documents, and the
            connection. This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmAction(null)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isActioning}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isActioning ? "Deleting..." : "Yes, delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
