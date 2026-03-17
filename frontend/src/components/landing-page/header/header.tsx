"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo/Logo";

export default function Header() {
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
    href: string,
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
        <Logo />

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
          <Link href="/signin" className="flex justify-between items-center">
            <Button variant="outline">Sign in</Button>
          </Link>
          <Link href="/signup" className="flex justify-between items-center ">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
