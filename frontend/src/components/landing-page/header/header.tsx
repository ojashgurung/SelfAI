"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Header() {
  const [activeSection, setActiveSection] = useState("hero");
  const navigationItems = [
    {
      title: "Home",
      href: "#hero",
    },
    {
      title: "How it works",
      href: "#how-it-works",
    },
    {
      title: "Analytics",
      href: "#analytics",
    },
    {
      title: "Features",
      href: "#features",
    },
  ];

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(href.substring(1));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map((item) => item.href.substring(1));
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-background">
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
        <Link href="/">
          <div className="flex items-center text-indigo-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 100 120"
            >
              <g transform="translate(10, 10) scale(0.08)">
                <path
                  fill="currentColor"
                  d="M455 891c-206-95-215-418-16-536 39-23 51-36 51-55 1-48 11-70 35-70 12 0 28 7 35 14 6 8 33 29 59 45 40 26 58 31 108 31 78 0 142 23 195 69 124 109 132 323 17 441-69 71-100 80-284 80-135 0-166-3-200-19zm344-51c192-55 217-349 37-431-27-12-65-19-111-19-63 0-75-3-122-35l-52-35-3 28c-2 21-13 32-48 48-64 30-116 91-136 159-33 116 27 243 132 280 46 17 252 20 303 5z"
                />
                <path
                  fill="currentColor"
                  d="M630 720c-11-22-38-51-60-65-22-14-40-30-40-35s18-21 40-35c22-14 49-43 60-65 11-22 25-40 30-40s19 18 30 40c11 22 38 51 60 65 22 14 40 30 40 35s-18 21-40 35c-22 14-49 43-60 65-11 22-25 40-30 40s-19-18-30-40z"
                />
              </g>
            </svg>
            <h1 className="text-xl font-semibold">selfAI.</h1>
          </div>
        </Link>
        <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
          <div className="flex justify-start gap-12 flex-row">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {item.href && (
                  <Link
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    className={`transition-colors ${
                      activeSection === item.href.substring(1)
                        ? "text-indigo-600 font-medium transition duration-200"
                        : "text-muted-foreground hover:text-indigo-600"
                    }`}
                  >
                    <p className="text-sm 2xl:text-base">{item.title}</p>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end w-full gap-4">
          {/* <Button
            variant="outline"
            className="hidden md:inline"
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector("#waitlist");
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          >
            Join Waitlist
          </Button> */}
          <div className="border-r hidden md:inline"></div>
          <Link
            href="/auth/signin"
            className="flex justify-between items-center"
          >
            <Button variant="outline">Sign in</Button>
          </Link>
          <Link
            href="/auth/signup"
            className="flex justify-between items-center "
          >
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
