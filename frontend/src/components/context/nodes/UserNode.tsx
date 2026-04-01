import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

export function UserNode({ data }: NodeProps) {
  return (
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: "#0a0a0a",
        border: "3px solid #0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 0 6px rgba(0,0,0,0.06)",
        cursor: "default",
      }}
    >
      <span
        style={{
          color: "#fff",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        {data.initials}
      </span>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}
