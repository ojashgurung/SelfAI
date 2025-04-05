"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWidgetStore } from "@/context/use-widget-context";

export default function AddToWebsitePage() {
  const [copied, setCopied] = useState(false);

  const embedCode = `<script src="https://selfai.io/widget.js" data-widget-id="test"></script>`;

  const handleCopyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    navigator.clipboard.writeText(embedCode);
    toast.success("Copied!", {
      description: "Widget embed code copied to clipboard",
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">
        Drop the widget to your site
        <br />
        and let it shine.
      </h1>

      <p className="text-lg text-gray-700 mb-8">
        Your SelfAI widget is ready! Drop the code into your site and let the
        conversations begin.
      </p>

      <div className="space-y-4">
        <div className="bg-gray-100 rounded-xl p-8 mb-8">
          <Button
            onClick={handleCopyCode}
            className="bg-black text-white hover:bg-black/90 mb-4"
          >
            {copied ? "Copied!" : "Copy code"}
          </Button>

          <p className="text-gray-600 mb-4">
            and paste it before the closing{" "}
            <code className="text-blue-600 font-mono">&lt;/body&gt;</code> tag
            to install on your website.
          </p>

          <div className="bg-white rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
              {embedCode || "Testing"}
            </pre>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Need help with the installation?
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="p-6 text-left flex items-center justify-between"
          >
            Send instructions
            <span className="text-xl">↗</span>
          </Button>
          <Button
            variant="outline"
            className="p-6 text-left flex items-center justify-between"
          >
            Write to us
            <span className="text-xl">➜</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
