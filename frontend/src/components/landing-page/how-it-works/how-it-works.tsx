import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { UploadCloud, BrainCog, Send } from "lucide-react";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import Image from "next/image";

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <div className="mx-auto max-w-container text-center flex flex-col items-center">
        <div className="bg-indigo-50/50 h-full p-24 rounded-xl relative">
          <div className="flex flex-col items-center gap-4 mb-16">
            <Badge variant="outline" className="bg-indigo-400 text-white">
              How it works
            </Badge>
            <h2 className="text-2xl font-medium max-w-[600px]">
              SelfAI helps you create a personal AI that speaks for you—powered
              by your data and designed to make you unforgettable.
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-12 max-w-[1000px] mx-auto mb-24">
            <div className="flex items-center gap-4">
              <div className="p-6 bg-white/70 rounded-full">
                <UploadCloud className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="text-lg text-muted-foreground">01</span>
                <div className="flex flex-col items-start text-start">
                  <h3 className="font-medium">Upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your resume, portfolio, or stories. SelfAI learns who
                    you are.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-6 bg-white/70 rounded-full">
                <BrainCog className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="text-lg text-muted-foreground">02</span>
                <div className="flex flex-col items-start text-start">
                  <h3 className="font-medium">Train</h3>
                  <p className="text-sm text-muted-foreground">
                    Your AI chatbot trains on your content — ready to talk like
                    you.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-6 bg-indigo-500 rounded-full">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="text-lg text-muted-foreground">03</span>
                <div className="flex flex-col items-start text-start">
                  <h3 className="font-medium">Share</h3>
                  <p className="text-sm text-muted-foreground">
                    Share a chat link or embed it. Let others connect instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[982px] -mt-32 relative z-10">
          <MockupFrame size="small" className="bg-indigo-400/70">
            <Mockup type="responsive">
              <Image
                src="/images/How-it-work.png"
                alt="SelfAI Dashboard"
                width={982}
                height={982}
                priority
                loading="eager"
                quality={75}
                className="w-full h-auto"
                unoptimized
              />
            </Mockup>
          </MockupFrame>
        </div>
      </div>
    </Section>
  );
}
