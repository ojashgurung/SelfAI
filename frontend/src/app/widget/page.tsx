"use client";

import { ChatWidget } from "@/components/widget/chat-widget";

export default function WidgetPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-2xl font-bold">Widget Preview</h1>
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white p-8 shadow">
          <h2 className="mb-4 text-xl">Sample Content</h2>
          <p className="text-gray-600">
            This is a sample page to demonstrate how the chat widget appears on
            a website. The widget should appear in the bottom-right corner.
          </p>
        </div>
      </div>
      <ChatWidget sessionId="preview-session" />
    </div>
  );
}
