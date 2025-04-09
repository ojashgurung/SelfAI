import { Section } from "@/components/ui/section";
import { FileText, Globe2, AppWindow, Languages } from "lucide-react";
import Image from "next/image";
import Glow from "@/components/ui/glow";

export default function AnalyticsSection() {
  return (
    <Section className="py-20 bg-white">
      <div className="mx-auto flex max-w-container flex-col gap-12 sm:gap-24">
        <div className="flex flex-col text-center gap-4">
          <h2 className="text-4xl font-semibold">
            All Your AI Insights{" "}
            <span className="text-indigo-600">on One Dashboard</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Stay on top of what matters — traffic, training progress, profile
            stats, and more at a glance.
          </p>
        </div>
        {/* 1st */}
        {/* Left Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-40 gap-y-12 items-center relative w-[90%] mx-auto">
          {/* Left Side */}
          <div className="space-y-4">
            <div className="flex justify-end w-full">
              <div className="max-w-xs">
                <Image
                  src="/images/Notifications.png"
                  alt="SelfAI Dashboard"
                  width={400}
                  height={300}
                  priority
                  loading="eager"
                  quality={75}
                  className="w-full h-full object-contain rounded-lg"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Middle Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-pink-500/20 to-transparent hidden md:block -translate-x-1/2" />
          {/* Right Side */}
          <div className="flex flex-col gap-4 w-[80%]">
            <h3 className="text-2xl font-semibold">
              Stay on Track with{" "}
              <span className="text-indigo-600">Live Insights</span>
            </h3>
            <p className="text-muted-foreground">
              Get real-time updates as your SelfAI evolves — from milestones
              like query growth to engagement trends. Each notification helps
              you understand how your chatbot is performing, right in your
              dashboard.
            </p>
          </div>

          {/* 2nd */}
          {/* Left Side */}
          <div className="space-y-4">
            <div className="flex flex-col gap-4 w-[85%] text-left">
              <h3 className="text-2xl font-semibold">
                Stay on top of your {""}
                <span className="text-indigo-600">onboarding journey</span>
              </h3>
              <p className="text-muted-foreground">
                SelfAI helps you monitor your profile setup at a glance.
                Complete steps like uploading documents and setting up widgets
                to unlock full platform capabilities.
              </p>
            </div>
          </div>

          {/* Middle Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-pink-500/20 to-transparent hidden md:block -translate-x-1/2" />

          {/* Right Side */}
          <div className="flex justify-end w-full">
            <div className="max-w-2xl">
              <Image
                src="/images/Profile-progress-bar.png"
                alt="SelfAI Dashboard"
                width={400}
                height={300}
                priority
                loading="eager"
                quality={75}
                className="w-full h-full object-contain rounded-lg"
                unoptimized
              />
              <Glow variant="top" />
            </div>
          </div>

          {/* 3rd */}
          {/* Left Side */}
          <div className="space-y-4">
            <div className="flex justify-end w-full">
              <div className="max-w-sm">
                <Image
                  src="/images/Connect-with-link.png"
                  alt="SelfAI Dashboard"
                  width={400}
                  height={300}
                  priority
                  loading="eager"
                  quality={75}
                  className="w-full h-full object-contain rounded-lg"
                  unoptimized
                />
                <Glow variant="bottom" />
              </div>
            </div>
          </div>

          {/* Middle Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-pink-500/20 to-transparent hidden md:block -translate-x-1/2" />

          {/* Right Side */}
          <div className="flex flex-col gap-4 w-[85%] text-left">
            <h3 className="text-2xl font-semibold">
              Instantly connect through {""}
              <span className="text-indigo-600">shared links</span>
            </h3>
            <p className="text-muted-foreground">
              Have someone’s SelfAI link? Just paste it here and start chatting
              with their personalized AI profile — no sign-in required.
            </p>
          </div>

          {/* 2nd */}
          {/* Left Side */}
          <div className="space-y-4">
            <div className="flex flex-col gap-4 w-[84%] text-left">
              <h3 className="text-2xl font-semibold">
                Track your SelfAI’s growth in {""}
                <span className="text-indigo-600">real-time</span>
              </h3>
              <p className="text-muted-foreground">
                Stay in the loop with weekly stats — total questions answered,
                visitor engagement, and lightning-fast response times. Know
                exactly how your SelfAI is performing and growing.
              </p>
            </div>
          </div>

          {/* Middle Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-pink-500/20 to-transparent hidden md:block -translate-x-1/2" />

          {/* Right Side */}
          <div className="flex justify-end w-full">
            <div className="max-w-3xl">
              <Image
                src="/images/Analytics.png"
                alt="SelfAI Dashboard"
                width={800}
                height={800}
                priority
                loading="eager"
                quality={75}
                className="w-full h-full object-contain rounded-lg"
                unoptimized
              />
              <Glow variant="top" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
