"use client";
import AnalyticsSection from "@/components/landing-page/analytics-section/analytics-section";
import { EmbedShareConnect } from "@/components/landing-page/embed-share-connect/enbed-share-connect";
import { Footer } from "@/components/landing-page/footer/footer";
import { HeroSection } from "@/components/landing-page/hero/hero-section";
import { HowItWorks } from "@/components/landing-page/how-it-works/how-it-works";
import { TryItNow } from "@/components/landing-page/try-it-now/try-it-now";

export default function Hero() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <AnalyticsSection />
      <EmbedShareConnect />
      <div className="relative -mb-32">
        <TryItNow />
      </div>
      <Footer />
    </>
  );
}
