"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { widgetService } from "@/lib/service/widget.service";
import { useWidgetStore } from "@/context/use-widget-context";

export default function WidgetPage() {
  const router = useRouter();
  const {
    setTheme,
    setHeading,
    setTitle,
    setSubTitle,
    setColor,
    setSelectedPrompts,
  } = useWidgetStore();
  const [copied, setCopied] = useState(false);
  const [widgetId, setWidgetId] = useState("");
  const [loading, setLoading] = useState(true);
  const [embedCode, setEmbedCode] = useState("");

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        const response = await widgetService.getWidget();
        if (!response) {
          router.push("/dashboard/widget/configuration");
          return;
        }
        setWidgetId(response.id);
        setEmbedCode(
          `<script src="https://selfai.io/widget.js" data-user-id="${response.user_id}"></script>`
        );
      } catch (error) {
        toast.error("No Widget exists", {
          description: "Please create a widget to continue",
        });
        router.push("/dashboard/widget/configuration");
      } finally {
        setLoading(false);
      }
    };

    fetchWidget();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCopyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    navigator.clipboard.writeText(embedCode);
    toast.success("Copied!", {
      description: "Widget embed code copied to clipboard",
    });
  };

  return (
    <div className="container max-w-4xl p-8 space-y-8">
      <h1 className="text-4xl font-bold">Your Widget is Live</h1>
      <p className="text-lg text-gray-700 mb-8">
        Your SelfAI widget is Live! Drop the code into your site and let the
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
      <div className="flex gap-4">
        <Button
          onClick={() =>
            router.push(`/dashboard/widget/configuration?id=${widgetId}`)
          }
          className="bg-purple-600 text-white hover:bg-purple-700"
        >
          Edit Widget
        </Button>

        <Button
          variant="destructive"
          onClick={async () => {
            try {
              await widgetService.deleteWidget(widgetId);
              setTheme("light");
              setHeading("");
              setTitle("");
              setSubTitle("");
              setColor("#6366F1");
              setSelectedPrompts([]);
              toast("Widget deleted successfully!", {
                description:
                  "Widget deleted please create new one to make it live again.",
              });
              router.push("/dashboard/widget/configuration");
            } catch (error) {
              toast.error("Failed to delete widget");
            }
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
