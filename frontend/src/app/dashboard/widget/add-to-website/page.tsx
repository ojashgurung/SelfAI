"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWidgetStore } from "@/context/use-widget-context";

export default function AddToWebsitePage() {
  const [copied, setCopied] = useState(false);
  // const { generateEmbedCode } = useWidgetStore();

  // const embedCode = generateEmbedCode();

  const handleCopy = async () => {
    // await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      <div className="bg-gray-100 rounded-xl p-8 mb-8">
        <Button
          onClick={handleCopy}
          className="bg-black text-white hover:bg-black/90 mb-4"
        >
          {copied ? "Copied!" : "Copy code"}
        </Button>

        <p className="text-gray-600 mb-4">
          and paste it before the closing{" "}
          <code className="text-blue-600 font-mono">&lt;/body&gt;</code> tag to
          install on your website.
        </p>

        <div className="bg-white rounded-lg p-4 font-mono text-sm overflow-x-auto">
          {/* <pre>{embedCode || "Testing"}</pre> */}
          EmbedCode
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
