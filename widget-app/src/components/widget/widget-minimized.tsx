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
  return (
    <Button
      onClick={() => setIsOpen(true)}
      className={`fixed bottom-5 right-5 rounded-full w-16 h-16 text-white shadow-lg transition-colors hover:brightness-90`}
      style={{
        backgroundColor: color,
      }}
    >
      <MessageSquare className="w-6 h-6" />
    </Button>
  );
}
