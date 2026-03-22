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

  return (
    <div
      onClick={isConnected ? data.onClick : undefined}
      style={{
        width: 110,
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

      {isConnected && (
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#4ade80",
          }}
        />
      )}
      {!isConnected && (
        <span style={{ fontSize: 9, color: "#d1d5db", fontWeight: 500 }}>
          Not connected
        </span>
      )}
    </div>
  );
}
