"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  GlobeIcon,
  UsersIcon,
  MapIcon,
  FileTextIcon,
  ClockIcon,
  FileIcon,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: HomeIcon, href: "/dashboard" },
  {
    title: "Connections",
    icon: GlobeIcon,
    href: "/dashboard/connections",
    subItems: [
      { title: "Connect LinkedIn", href: "/dashboard/connections/linkedin" },
      { title: "Comment Scrapper", href: "/dashboard/connections/scrapper" },
    ],
  },
  { title: "Networks", icon: UsersIcon, href: "/dashboard/networks" },
  { title: "Network Map", icon: MapIcon, href: "/dashboard/network-map" },
  { title: "Templates", icon: FileTextIcon, href: "/dashboard/templates" },
  {
    title: "Business Plan Generators",
    icon: FileIcon,
    href: "/dashboard/business-plan",
  },
  { title: "Pitch Deck", icon: FileIcon, href: "/dashboard/pitch-deck" },
  { title: "Recents", icon: ClockIcon, href: "/dashboard/recents" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-emerald-700 rounded-full" />
        <h1 className="text-xl font-semibold text-emerald-700">simplexity.</h1>
      </div>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search"
          className="w-full bg-gray-50"
        />
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <div key={item.title}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50",
                pathname === item.href && "bg-gray-50 text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Link>
            {item.subItems && (
              <div className="ml-8 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.href}
                    className={cn(
                      "block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md",
                      pathname === subItem.href && "bg-gray-50 text-gray-900"
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
