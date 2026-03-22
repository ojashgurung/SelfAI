import { ALL_SOURCES } from "./source-config";

export function getSourcePosition(
  index: number,
  total: number,
  radius = 220,
): { x: number; y: number } {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

export function buildGraphNodes(
  sourcesData: any[],
  connected: string[],
  initials: string,
  onSourceClick: (platform: string) => void,
) {
  const centerNode = {
    id: "user",
    type: "userNode",
    position: { x: 0, y: 0 },
    data: { initials },
    draggable: false,
  };

  // Only show nodes for sources that exist in backend
  const sourceNodes = connected.map((platform, i) => {
    const pos = getSourcePosition(i, connected.length);
    return {
      id: `source-${platform}`,
      type: "sourceNode",
      position: { x: pos.x - 55, y: pos.y - 55 },
      data: {
        platform,
        isConnected: true,
        isSelected: false,
        onClick: () => onSourceClick(platform),
      },
      draggable: false,
    };
  });

  return [centerNode, ...sourceNodes];
}

export function buildGraphEdges(connected: string[]) {
  return connected.map((platform) => ({
    id: `edge-${platform}`,
    source: "user",
    target: `source-${platform}`,
    style: { stroke: "#0a0a0a", strokeWidth: 2 },
    animated: true,
  }));
}
export function getConnectedPlatforms(sources: any[]): string[] {
  return sources
    .filter((s: any) => s.status === "connected" || s.last_ingested_at)
    .map((s: any) => s.platform as string);
}

export function getUserInitials(fullname?: string): string {
  if (!fullname) return "ME";
  return fullname
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();
}
