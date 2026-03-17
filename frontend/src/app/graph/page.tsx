"use client";

import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

export default function GraphPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"; // Use Next.js proxy by default

  useEffect(() => {
    async function loadGraph() {
      const reqId = Math.random().toString(36).slice(2, 8);
      console.groupCollapsed(`Graph load [${reqId}]`);
      console.log("Fetching:", `${API_BASE}/graph/view`);
      try {
        const res = await fetch(`${API_BASE}/graph/view`, {
          cache: "no-store",
          credentials: "include", // include cookies for auth (works for same-origin and cross-origin)
        });
        if (!res.ok) {
          console.error("Response not ok:", res.status, res.statusText);
          if (res.status === 401) {
            setError("unauthorized");
            return;
          }
          throw new Error(`Failed to load graph: ${res.status}`);
        }
        const data = await res.json();
        console.log("Graph data:", data);

        const mappedNodes = (data?.nodes || []).map(
          (node: any, idx: number) => ({
            id: String(node.id ?? idx),
            position: { x: Math.random() * 600, y: Math.random() * 600 },
            data: {
              label: `${node.type ?? "node"}: ${node.title ?? "Untitled"}`,
            },
          })
        );

        const mappedEdges = (data?.edges || []).map(
          (edge: any, idx: number) => {
            const source = String(
              edge.source ?? edge.source_id ?? edge.from ?? ""
            );
            const target = String(
              edge.target ?? edge.target_id ?? edge.to ?? ""
            );
            const id = String(edge.id ?? `${source}-${target}-${idx}`);
            return { id, source, target };
          }
        );

        console.log(
          "Mapped nodes:",
          mappedNodes.length,
          "Mapped edges:",
          mappedEdges.length
        );
        setNodes(mappedNodes);
        setEdges(mappedEdges);
      } catch (err) {
        console.error("Graph load error:", err);
        if (!error) setError("load_failed");
        setNodes([]);
        setEdges([]);
      } finally {
        console.groupEnd();
      }
    }

    loadGraph();
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {error === "unauthorized" ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Sign in required</h2>
            <p className="mb-4">Please sign in to view your graph.</p>
            <a
              href="/auth/signin"
              className="inline-block px-4 py-2 rounded bg-black text-white"
            >
              Go to Sign In
            </a>
          </div>
        </div>
      ) : (
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      )}
    </div>
  );
}
