import { Section } from "@/components/ui/section";
import { Code2, QrCode, Link2 } from "lucide-react";

export function EmbedShareConnect() {
  return (
    <Section className="mb-28" id="features">
      <div className="mx-auto flex max-w-container flex-col gap-12">
        <div className="flex flex-col text-center gap-4">
          <h2 className="text-4xl font-bold sm:text-4xl">
            Embed <span className="text-indigo-600">Share</span> Connect
          </h2>
          <p className="text-muted-foreground text-lg w-[50%] mx-auto">
            Whether it’s a website, resume, or a business card — SelfAI lets you
            share your AI agent with the world. Copy a link, scan a QR code, or
            embed a widget. It’s sharing, simplified.
          </p>
        </div>
        <div className="flex flex-col items-center text-center"></div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center bg-white p-8 rounded-xl">
            <div className="mb-6 p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/20">
              <Code2 className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Create Website Widget
            </h3>
            <p className="text-muted-foreground mb-6">
              Embed a smart chat widget into your personal site or portfolio —
              just copy-paste a snippet of code.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center bg-white p-12 rounded-xl">
            <div className="mb-6 p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/20">
              <QrCode className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">QR Code Sharing</h3>
            <p className="text-muted-foreground">
              Download a QR code to place on resumes, business cards, or posters
              — let others scan and chat with your AI.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center bg-white p-12 rounded-xl">
            <div className="mb-6 p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/20">
              <Link2 className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Connect via Link</h3>
            <p className="text-muted-foreground">
              Generate a unique link for your AI agent that anyone can access
              instantly — no login required.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
