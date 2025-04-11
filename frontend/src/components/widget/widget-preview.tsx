import { ChatWidget } from "@/components/widget/chat-widget";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { widgetService } from "@/lib/service/widget.service";
import { useWidgetStore } from "@/context/use-widget-context";

export function WidgetPreview() {
  const router = useRouter();
  const {
    setTheme,
    setHeading,
    setTitle,
    setSubTitle,
    setColor,
    setSelectedPrompts,
  } = useWidgetStore();

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        const response = await widgetService.getWidget();
        if (!response) {
          router.push("/dashboard/widget/configuration");
          return;
        }
        setTheme(response.theme as "light" | "dark");
        setHeading(response.heading);
        setTitle(response.title);
        setSubTitle(response.subtitle);
        setColor(response.color);
        setSelectedPrompts(response.prompts);
        return response;
      } catch (error) {
        toast.error("No Widget exists", {
          description: "Please create a widget to continue",
        });
        router.push("/dashboard/widget/configuration");
      }
    };

    fetchWidget();
  }, [
    router,
    setTheme,
    setHeading,
    setTitle,
    setSubTitle,
    setColor,
    setSelectedPrompts,
  ]);
  return (
    <div
      className="relative rounded-lg bg-white w-full h-[740px] 2xl:h-[860px]  bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/images/browser.png")',
        backgroundPosition: "left center",
      }}
    >
      <div className="absolute bottom-4 right-4">
        <ChatWidget />
      </div>
    </div>
  );
}
