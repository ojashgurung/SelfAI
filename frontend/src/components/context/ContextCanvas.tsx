"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ReactFlow, {
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus, X } from "lucide-react";

import { sourcesService } from "@/lib/service/sources.service";
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

export default function ContextCanvas() {
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

      const connected = getConnectedPlatforms(sourcesResult);
      setConnectedPlatforms(connected);

      const initials = getUserInitials(user?.fullname);

      const newNodes = buildGraphNodes(
        sourcesResult,
        connected,
        initials,
        (platform) => handleSourceClick(platform, sourcesResult),
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

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Detect OAuth callback redirect (?connected=github)
  useEffect(() => {
    const connected = searchParams.get("connected");
    if (connected) {
      window.history.replaceState({}, "", "/context");
      fetchData();
    }
  }, [searchParams, fetchData]);

  // Update selected highlight in nodes
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
      <div className="flex-1 flex items-center justify-center bg-[#f8f8f7]">
        <div className="text-sm text-gray-400">Loading context...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full relative overflow-hidden">
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
        minZoom={0.5}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e5e5e5"
        />
      </ReactFlow>

      {connectedPlatforms.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center mt-24">
            <p className="text-sm font-medium text-gray-400 mb-1">
              No sources connected yet
            </p>
            <p className="text-xs text-gray-300">
              Click + Add Source below to get started
            </p>
          </div>
        </div>
      )}
      {/* Add Source button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="absolute bottom-6 left-6 z-10 flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-xl shadow-lg hover:bg-gray-800 transition-all duration-150"
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
        <div
          className="absolute right-0 top-0 bottom-0 w-[380px] bg-white border-l border-gray-100 overflow-y-auto shadow-xl z-10"
          style={{ animation: "slideIn 0.2s ease" }}
        >
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
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
