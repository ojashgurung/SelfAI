"use client";

import { useParams } from "next/navigation";
import { ChatWidget } from "@/components/widget/chat-widget";
import { useEffect, useState } from "react";
import { widgetService } from "@/lib/service/widget.service";
import { useEmbeddedWidgetStore } from "@/context/use-embedded-widget-context";

export default function WidgetChatPage() {
  const { widget_id } = useParams();
  const [loading, setLoading] = useState(true);
  const {
    setTheme,
    setHeading,
    setTitle,
    setSubTitle,
    setColor,
    setSelectedPrompts,
  } = useEmbeddedWidgetStore();

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        const response = await widgetService.getPublicWidget(
          widget_id as string
        );
        setTheme(response.theme as "light" | "dark");
        setHeading(response.heading);
        setTitle(response.title);
        setSubTitle(response.subtitle);
        setColor(response.color);
        setSelectedPrompts(response.prompts);
      } catch (error) {
        console.error("Failed to load widget:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWidget();
  }, [widget_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <ChatWidget embedded={true} />;
}
