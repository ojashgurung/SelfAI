"use client";

import { WidgetPreview } from "@/components/widget/widget-preview";

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full p-8">
      <h1 className="mb-8 text-2xl font-bold">Widget Configuration</h1>

      <div className="grid grid-cols-2 gap-8 mx-auto max-w-6xl 2xl:container h-[calc(100%-5rem)]">
        <main className="flex-1">{children}</main>
        <WidgetPreview />
      </div>
    </div>
  );
}
