import { ChatWidget } from "@/components/widget/chat-widget";

export function WidgetPreview() {
  return (
    <div
      className="relative rounded-lg bg-white w-full h-[740px] 2xl:h-[860px]  bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/images/browser.png")',
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute bottom-4 right-4">
        <ChatWidget />
      </div>
    </div>
  );
}
