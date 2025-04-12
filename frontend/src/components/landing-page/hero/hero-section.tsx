import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import Glow from "@/components/ui/glow";
import Image from "next/image";
import Github from "@/components/logos/github";
import Link from "next/link";

export function HeroSection() {
  return (
    <Section
      className="fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0"
      id="hero"
    >
      <div className="mx-auto flex max-w-container flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-4">
          <Badge variant="outline" className="animate-appear">
            <span className="text-muted-foreground">
              New version Self AI is out!
            </span>
            <Link
              href="/signup"
              className="flex text-indigo-600 items-center gap-1"
            >
              Get started
              <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </Badge>
          <div className="flex flex-col leading-none">
            <h1 className="relative z-10 inline-block animate-appear bg-gradient-to-r from-foreground to-foreground bg-clip-text text-3xl font-bold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-6xl md:leading-tight dark:to-muted-foreground">
              Build Your Own AI Agent <br></br> Let it speak for you
            </h1>
          </div>
          <p className="text-md relative mt-4 z-10 max-w-[700px] animate-appear font-medium text-muted-foreground opacity-0 delay-100 sm:text-xl">
            Create your personalized AI agent in minutes and easily integrate it
            into your portfolio, website, or business card to boost your
            professional presence.
          </p>
          <div className="flex gap-4 mt-8 z-12">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="animate-appear opacity-0 delay-300 bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="ghost"
                size="lg"
                className="animate-appear opacity-0 delay-300 flex items-center"
              >
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
            </Link>
          </div>

          <div className="relative w-full max-w-[1400px] mx-auto mt-12 ">
            {/* Main Dashboard Mockup */}
            <div className="relative z-[2]">
              <MockupFrame size="small" className="bg-indigo-600/70">
                <Image
                  src="/images/Dashboard.png"
                  alt="SelfAI Dashboard"
                  width={1920}
                  height={1080}
                  priority
                  loading="eager"
                  quality={100}
                  className="w-full h-auto rounded-lg shadow-2xl"
                  unoptimized
                />
              </MockupFrame>
              <Glow variant="top" className="pointer-events-none" />
            </div>

            {/* Chat Overlay Mockup */}
            <div className="absolute -bottom-12 left-0 w-[70%] transform -translate-x-20 z-[2]">
              <MockupFrame size="small" className="bg-indigo-400/70">
                <Image
                  src="/images/Chat_I.png"
                  alt="SelfAI Chat Interface"
                  width={1000}
                  height={1000}
                  priority
                  loading="eager"
                  quality={100}
                  className="w-full h-auto rounded-lg shadow-2xl"
                  unoptimized
                />
              </MockupFrame>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
