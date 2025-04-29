"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface WidgetMinimizedPageProps {
  setIsOpen: (isOpen: boolean) => void;
  color?: string;
  theme?: "light" | "dark";
}

export function WidgetMinimizedPage({
  setIsOpen,
  color,
  theme,
}: WidgetMinimizedPageProps) {
  const handleMaximize = () => {
    window.parent.postMessage({ type: "maximize" }, "*");
    setIsOpen(true);
  };
  return (
    <Button
      onClick={handleMaximize}
      className={`fixed bottom-0 right-0 rounded-full w-16 h-16 text-white shadow-lg transition-colors hover:brightness-90`}
      style={{
        backgroundColor: color,
      }}
    >
      <MessageSquare className="w-6 h-6" />
    </Button>
  );
}
