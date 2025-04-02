import { ChatWidget } from "@/components/widget/chat-widget";

interface ChatPreviewProps {
  sessionId: string;
  theme: "light" | "dark";
  color: string;
  heading: string;
  title: string;
  subTitle: string;
  selectedPrompts?: Array<{
    title: string;
    content: string;
    icon: React.ComponentType<React.ComponentProps<"svg">>;
  }>;
}

export function WidgetPreview() {
  return (
    <div
      className="relative rounded-lg bg-white h-[700px] 2xl:h-[800px] shadow bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/images/browser.png")' }}
    >
      <div className="absolute bottom-4 right-4">
        <div>
          <ChatWidget />
        </div>
      </div>
    </div>
  );
}
