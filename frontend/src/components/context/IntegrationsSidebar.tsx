import React from "react";
import { ConnectGithubDialog } from "@/components/dialog/connect-github-dialog";
import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import {
  Search,
  ChevronDown,
  Star,
  Mail,
  FileSpreadsheet,
  FileText,
  Box,
  File,
  HardDrive,
  RefreshCw,
  LucideIcon,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";

type IntegrationItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  isFavorite: boolean;

  // NEW
  isConnected: boolean;
  isEnabled: boolean; // toggle ON/OFF
  metadata?: {
    username?: string;
    lastSynced?: string;
    repoCount?: number;
    primaryLanguages?: string[];
  };
};

interface Integration {
  id: string;
  title: string;
  items: IntegrationItem[];
}

// Mock data for the sidebar sections
const integrations: Integration[] = [
  {
    id: "favorites",
    title: "Favorites",
    items: [],
  },
  {
    id: "integration",
    title: "Integration",
    items: [
      {
        id: "github",
        title: "GitHub",
        subtitle: "Connect your repositories",
        icon: FaGithub as React.ElementType,
        iconColor: "text-black",
        iconBg: "bg-gray-100",
        isFavorite: false,

        isConnected: false,
        isEnabled: false,
      },
    ],
  },
];

export default function IntegrationsSidebar() {
  const [showGithubDialog, setShowGithubDialog] = useState(false);

  const handleItemClick = (itemId: string) => {
    if (itemId === "github") {
      setShowGithubDialog(true);
    }
  };

  return (
    <div className="w-80 h-full border-r bg-white flex flex-col">
      <ConnectGithubDialog
        isOpen={showGithubDialog}
        onClose={() => setShowGithubDialog(false)}
      />
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Find"
            className="pl-9 bg-gray-50 border-transparent focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Accordion.Root
          type="multiple"
          defaultValue={["integration", "stores-utility"]}
          className="w-full"
        >
          {integrations.map((integration) => (
            <Accordion.Item
              key={integration.id}
              value={integration.id}
              className="border-b last:border-0"
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="flex flex-1 items-center justify-between py-4 px-4 text-sm font-medium transition-all hover:bg-gray-50 [&[data-state=open]>svg]:rotate-180">
                  {integration.title}
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="px-3 pb-3 pt-0 flex flex-col gap-2">
                  {integration.items.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-xs italic">
                      No items
                    </div>
                  ) : (
                    integration.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className="group flex items-center gap-3 rounded-lg border p-3 hover:shadow-md transition-all cursor-pointer bg-white"
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                            item.iconBg,
                          )}
                        >
                          <item.icon
                            className={cn("h-5 w-5", item.iconColor)}
                          />
                        </div>
                        <div className="flex flex-1 flex-col overflow-hidden">
                          <span className="truncate font-medium">
                            {item.title}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {item.subtitle}
                          </span>
                        </div>
                        <button className="text-muted-foreground hover:text-yellow-400 focus:outline-none">
                          <Star
                            className={cn(
                              "h-4 w-4",
                              item.isFavorite
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300",
                            )}
                          />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </div>
  );
}
