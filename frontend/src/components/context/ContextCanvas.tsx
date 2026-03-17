import React, { useState, useEffect } from "react";
import { sourcesService } from "@/lib/service/sources.service";
import { ConnectedState } from "./states/ConnectedState";
import { integrationService } from "@/lib/service/integration.service";

type IdentityState = "empty" | "connected" | "compiled";

export default function ContextCanvas() {
  const [state, setState] = useState<IdentityState>("empty");
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sourcesResult = await sourcesService.getALlSources();
        if (sourcesResult && sourcesResult.length > 0) {
          setSources(sourcesResult);

          // Check if identity is compiled
          const identityStatus = await integrationService.getIdentityStatus();
          if (identityStatus?.compiled) {
            setState("compiled");
          } else {
            setState("connected");
          }
        } else {
          setState("empty");
        }
      } catch (error) {
        console.error("Failed to fetch context data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center p-10 bg-gray-50">
      <div className="w-full max-w-3xl space-y-6">
        {state === "empty" && (
          <div className="rounded-2xl bg-white p-8 shadow-sm border">
            <h2 className="text-xl font-semibold mb-2">Identity Context</h2>
            <p className="text-sm text-muted-foreground mb-6">
              No sources connected yet. Connect GitHub to start building your
              identity model.
            </p>
          </div>
        )}

        {state === "connected" && <ConnectedState sources={sources} />}
      </div>
    </div>
  );
}
