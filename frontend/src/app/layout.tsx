import type { Metadata } from "next";
import { NavigationWrapper } from "@/components/landing-page/navigation-wrapper/navigarion-wrapper";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SelfAI — Your AI-Powered Identity",
  description: "Create, share, and network with your personal AI.",
  icons: {
    icon: "/favicon.svg",
  },
  themeColor: "#4f46e5", // Tailwind's indigo-600
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <NavigationWrapper>{children}</NavigationWrapper>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
