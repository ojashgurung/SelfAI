"use client";
import AnalyticsSection from "@/components/landing-page/analytics-section/analytics-section";
import { Footer } from "@/components/landing-page/footer/footer";
import { HeroSection } from "@/components/landing-page/hero/hero-section";
import { HowItWorks } from "@/components/landing-page/how-it-works/how-it-works";

export default function Hero() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <AnalyticsSection />
      <Footer />
    </>
  );
}
