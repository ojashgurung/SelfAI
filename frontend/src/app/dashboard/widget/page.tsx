"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { widgetService } from "@/lib/service/widget.service";
import { useWidgetStore } from "@/context/use-widget-context";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function WidgetPage() {
  const router = useRouter();
  const { user } = useAuth();
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
    let isMounted = true;
    const fetchWidget = async () => {
      if (!user) return;

      try {
        const response = await widgetService.getWidget();
        if (!response) {
          if (isMounted) {
            toast.error("No widget yet", {
              description: "You need to create a widget before continuing.",
            });
            router.push("/dashboard/widget/configuration");
          }
          return;
        }

        if (isMounted) {
          setWidgetId(response.id);
          setEmbedCode(
            `<script src="https://selfai.io/widget.js" data-user-id="${response.user_id}"></script>`
          );
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Failed to load widget");
          router.push("/dashboard/widget/configuration");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWidget();
    return () => {
      isMounted = false;
    };
  }, [router, user]);

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
        <div className="bg-gray-100 rounded-xl p-8">
          <div className="flex justify-between mb-4">
            <Button
              onClick={handleCopyCode}
              className="bg-black text-white hover:bg-black/90 mb-4"
            >
              {copied ? "Copied!" : "Copy code"}
            </Button>
            <div className="flex gap-4">
              <Button
                onClick={() =>
                  router.push(`/dashboard/widget/configuration?id=${widgetId}`)
                }
                size="icon"
                className="h-10 w-10 bg-purple-600 text-white hover:bg-purple-700"
                title="Edit Widget"
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                variant="destructive"
                size="icon"
                className="h-10 w-10"
                title="Delete Widget"
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
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

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
    </div>
  );
}
