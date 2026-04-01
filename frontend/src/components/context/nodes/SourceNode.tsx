import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { FileText } from "lucide-react";
import { SOURCE_CONFIG } from "../utils/source-config";

export function SourceNode({ data }: NodeProps) {
  const config = SOURCE_CONFIG[data.platform] || {
    label: data.platform,
    icon: FileText,
    color: "#6b7280",
    bg: "#f9fafb",
  };
  const Icon = config.icon;
  const { isConnected, isSelected } = data;

  const isDocuments = data.platform === "documents";
  const docCount = data.documentCount || 0;
  const docNames: string[] = data.documentNames || [];

  return (
    <div
      onClick={isConnected ? data.onClick : undefined}
      style={{
        width: isDocuments && isConnected && docCount > 0 ? 140 : 110,
        background: isConnected ? "#0a0a0a" : "#f5f5f5",
        border: `2px solid ${isSelected ? "#0a0a0a" : isConnected ? "#0a0a0a" : "#e5e5e5"}`,
        borderRadius: 16,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        cursor: isConnected ? "pointer" : "default",
        opacity: isConnected ? 1 : 0.35,
        boxShadow: isSelected
          ? "0 0 0 4px rgba(0,0,0,0.12)"
          : isConnected
            ? "0 4px 16px rgba(0,0,0,0.12)"
            : "none",
        transition: "all 0.2s ease",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />

      {/* Icon with count badge */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: isConnected ? "rgba(255,255,255,0.12)" : config.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            style={{
              width: 18,
              height: 18,
              color: isConnected ? "#fff" : config.color,
            }}
          />
        </div>
        {isDocuments && isConnected && docCount > 0 && (
          <div
            style={{
              position: "absolute",
              top: -6,
              right: -10,
              background: "#2563eb",
              color: "#fff",
              fontSize: 9,
              fontWeight: 700,
              borderRadius: 8,
              minWidth: 18,
              height: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 5px",
              border: "2px solid #0a0a0a",
            }}
          >
            {docCount}
          </div>
        )}
      </div>

      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: isConnected ? "#fff" : "#9ca3af",
          letterSpacing: 0.2,
        }}
      >
        {config.label}
      </span>

      {/* Document file previews */}
      {isDocuments && isConnected && docCount > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "100%",
            alignItems: "center",
          }}
        >
          {docNames.slice(0, 2).map((name: string, i: number) => (
            <span
              key={i}
              style={{
                fontSize: 8,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
              }}
              title={name}
            >
              {name}
            </span>
          ))}
          {docCount > 2 && (
            <span style={{ fontSize: 8, color: "rgba(255,255,255,0.35)" }}>
              +{docCount - 2} more
            </span>
          )}
        </div>
      ) : isConnected ? (
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#4ade80",
          }}
        />
      ) : (
        <span style={{ fontSize: 9, color: "#d1d5db", fontWeight: 500 }}>
          Not connected
        </span>
      )}
    </div>
  );
}

