"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ReactFlow, {
  Background,
  BackgroundVariant,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Plus,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";

import { sourcesService } from "@/lib/service/sources.service";
import { DocumentService } from "@/lib/service/document.service";
import { useAuth } from "@/hooks/use-auth";
import { UserNode } from "./nodes/UserNode";
import { SourceNode } from "./nodes/SourceNode";
import SourceDetails from "./SourceDetails";
import IntegrationsSidebar from "./IntegrationsSidebar";
import {
  buildGraphNodes,
  buildGraphEdges,
  getConnectedPlatforms,
  getUserInitials,
} from "./utils/graph-helpers";

const nodeTypes = { userNode: UserNode, sourceNode: SourceNode };

/* ─── Zoom Controls ─────────────────────────────────────── */
function ZoomToolbar() {
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();
  const [zoom, setZoom] = useState(100);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setZoom(Math.round(getZoom() * 100));
    }, 200);
    return () => clearInterval(interval);
  }, [getZoom]);

  return (
    <div className="ctx-zoom-toolbar">
      <button
        onClick={() => zoomIn({ duration: 200 })}
        className="ctx-zoom-btn"
        title="Zoom in"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>

      <span className="ctx-zoom-label">{zoom}%</span>

      <button
        onClick={() => zoomOut({ duration: 200 })}
        className="ctx-zoom-btn"
        title="Zoom out"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>

      <div className="ctx-zoom-divider" />

      <button
        onClick={() => fitView({ duration: 300, padding: 0.3 })}
        className="ctx-zoom-btn"
        title="Fit to view"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ─── Main Canvas (inner) ───────────────────────────────── */
function CanvasInner() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [sources, setSources] = useState<any[]>([]);
  const [selectedSource, setSelectedSource] = useState<any | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleSourceClick = useCallback(
    (platform: string, sourcesData: any[]) => {
      const source = sourcesData.find((s) => s.platform === platform);
      if (source) setSelectedSource(source);
    },
    [],
  );

  const fetchData = useCallback(async () => {
    try {
      const sourcesResult = (await sourcesService.getALlSources()) || [];
      setSources(sourcesResult);

      const docsSource = sourcesResult.find(
        (s: any) => s.platform === "documents",
      );
      const documents = docsSource
        ? await DocumentService.getDocuments(docsSource.id).catch(() => [])
        : [];

      const connected = getConnectedPlatforms(sourcesResult);
      setConnectedPlatforms(connected);

      const initials = getUserInitials(user?.fullname);

      const newNodes = buildGraphNodes(
        sourcesResult,
        connected,
        initials,
        (platform) => handleSourceClick(platform, sourcesResult),
        documents,
      );
      const newEdges = buildGraphEdges(connected);

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (error) {
      console.error("Failed to fetch context data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, handleSourceClick, setNodes, setEdges]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const connected = searchParams.get("connected");
    if (connected) {
      window.history.replaceState({}, "", "/context");
      fetchData();
    }
  }, [searchParams, fetchData]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === "sourceNode") {
          return {
            ...node,
            data: {
              ...node.data,
              isSelected: selectedSource?.platform === node.data.platform,
            },
          };
        }
        return node;
      }),
    );
  }, [selectedSource, setNodes]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center ctx-canvas-bg">
        <div className="ctx-loader">
          <div className="ctx-loader-ring" />
          <p className="ctx-loader-text">Loading context…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full relative overflow-hidden ctx-canvas-bg">
      {/* Graph */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        panOnDrag
        zoomOnScroll
        minZoom={0.25}
        maxZoom={3}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="rgba(0,0,0,0.08)"
        />

        {/* Minimap */}
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(n) => (n.type === "userNode" ? "#0a0a0a" : "#94a3b8")}
          maskColor="rgba(248,248,247,0.85)"
          style={{
            background: "rgba(255,255,255,0.7)",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.06)",
            backdropFilter: "blur(8px)",
          }}
          pannable
          zoomable
        />
      </ReactFlow>

      {/* Empty state */}
      {connectedPlatforms.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center mt-24">
            <div className="ctx-empty-icon">
              <Plus className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400 mb-1 mt-4">
              No sources connected yet
            </p>
            <p className="text-xs text-gray-300">
              Click <span className="font-semibold text-gray-400">+ Add Source</span> to get started
            </p>
          </div>
        </div>
      )}

      {/* Zoom toolbar */}
      <ZoomToolbar />

      {/* Add Source button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="ctx-add-source-btn"
      >
        <Plus className="w-4 h-4" />
        Add Source
      </button>

      {/* Integrations Drawer */}
      <IntegrationsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        connectedPlatforms={connectedPlatforms}
        onConnectionAdded={() => {
          setIsSidebarOpen(false);
          fetchData();
        }}
      />

      {/* Source Details Panel */}
      {selectedSource && (
        <div className="ctx-details-panel" style={{ animation: "ctxSlideIn 0.25s cubic-bezier(.4,0,.2,1)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">
              Source Details
            </p>
            <button
              onClick={() => setSelectedSource(null)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <SourceDetails
            source={selectedSource}
            onDisconnected={() => {
              setSelectedSource(null);
              fetchData();
            }}
            onDeleted={() => {
              setSelectedSource(null);
              fetchData();
            }}
          />
        </div>
      )}

      {/* ─── Canvas Styles ─── */}
      <style>{`
        /* Canvas background */
        .ctx-canvas-bg {
          background:
            radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.04) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 80%, rgba(168,85,247,0.03) 0%, transparent 60%),
            #fafaf9;
        }

        /* Loading */
        .ctx-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .ctx-loader-ring {
          width: 32px;
          height: 32px;
          border: 2.5px solid rgba(0,0,0,0.06);
          border-top-color: #0a0a0a;
          border-radius: 50%;
          animation: ctxSpin 0.8s linear infinite;
        }
        .ctx-loader-text {
          font-size: 13px;
          color: #a1a1aa;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        /* Empty state icon */
        .ctx-empty-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          border: 2px dashed #e5e5e5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        /* Zoom toolbar */
        .ctx-zoom-toolbar {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 4px;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 14px;
          box-shadow:
            0 1px 3px rgba(0,0,0,0.04),
            0 8px 24px rgba(0,0,0,0.06);
        }
        .ctx-zoom-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #52525b;
          transition: all 0.15s ease;
        }
        .ctx-zoom-btn:hover {
          background: rgba(0,0,0,0.06);
          color: #0a0a0a;
        }
        .ctx-zoom-label {
          font-size: 10px;
          font-weight: 600;
          color: #a1a1aa;
          min-width: 36px;
          text-align: center;
          letter-spacing: 0.04em;
          user-select: none;
        }
        .ctx-zoom-divider {
          width: 1px;
          height: 18px;
          background: rgba(0,0,0,0.08);
          margin: 0 2px;
        }

        /* Add Source button */
        .ctx-add-source-btn {
          position: absolute;
          bottom: 24px;
          left: 24px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #0a0a0a;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          box-shadow:
            0 2px 8px rgba(0,0,0,0.12),
            0 8px 32px rgba(0,0,0,0.08);
          transition: all 0.2s cubic-bezier(.4,0,.2,1);
        }
        .ctx-add-source-btn:hover {
          background: #171717;
          transform: translateY(-1px);
          box-shadow:
            0 4px 12px rgba(0,0,0,0.16),
            0 12px 40px rgba(0,0,0,0.10);
        }
        .ctx-add-source-btn:active {
          transform: translateY(0);
        }

        /* Details panel */
        .ctx-details-panel {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 380px;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-left: 1px solid rgba(0,0,0,0.06);
          overflow-y: auto;
          z-index: 10;
          box-shadow:
            -4px 0 24px rgba(0,0,0,0.04),
            -1px 0 0 rgba(0,0,0,0.02);
        }

        /* Override ReactFlow minimap position */
        .react-flow__minimap {
          bottom: 24px !important;
          right: 24px !important;
          width: 140px !important;
          height: 100px !important;
        }

        /* Override ReactFlow edge animation for subtlety */
        .react-flow__edge-path {
          stroke: #0a0a0a !important;
          stroke-width: 1.5 !important;
        }

        /* Animations */
        @keyframes ctxSlideIn {
          from { transform: translateX(16px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes ctxSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ─── Wrapper with ReactFlowProvider ────────────────────── */
export default function ContextCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
