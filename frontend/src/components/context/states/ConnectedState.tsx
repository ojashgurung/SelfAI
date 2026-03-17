import React from "react";

interface Source {
  id: string;
  platform: string;
  display_name: string;
  status: string;
  last_synced_at: string | null;
  source_metadata: {
    repoCount?: number;
    primaryLanguages?: string[];
    [key: string]: any;
  };
}

interface ConnectedStateProps {
  sources: Source[];
}

export function ConnectedState({ sources }: ConnectedStateProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-4">
      {sources.map((source) => (
        <div
          key={source.id}
          className="rounded-2xl bg-white p-6 shadow-sm border"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold capitalize flex items-center gap-2">
              {source.platform}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full capitalize ${
                source.status === "connected"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {source.status}
            </span>
          </div>

          <p className="text-sm font-medium">{source.display_name}</p>

          <div className="mt-4 space-y-1 text-sm text-muted-foreground">
            {source.last_synced_at && (
              <p>Last synced: {formatDate(source.last_synced_at)}</p>
            )}

            {source.source_metadata?.repoCount !== undefined && (
              <p>Repositories: {source.source_metadata.repoCount}</p>
            )}

            {source.source_metadata?.primaryLanguages && (
              <p>
                Primary Languages:{" "}
                {Array.isArray(source.source_metadata.primaryLanguages)
                  ? source.source_metadata.primaryLanguages.join(", ")
                  : source.source_metadata.primaryLanguages}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
