"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  GlobeIcon,
  UsersIcon,
  FileTextIcon,
  FileIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Search,
  Command,
  Settings,
  LogOut,
  User,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  { title: "Overview", icon: HomeIcon, href: "/dashboard" },
  {
    title: "Connections",
    icon: GlobeIcon,
    href: "/dashboard/connections",
    subItems: [
      { title: "Connect LinkedIn", href: "/dashboard/connections/linkedin" },
      { title: "Comment GitHub", href: "/dashboard/connections/github" },
    ],
  },
  {
    title: "Uploaded Documents",
    icon: FileTextIcon,
    href: "/dashboard/uploaded-documents",
  },
  {
    title: "Embedding Generator",
    icon: FileIcon,
    href: "/dashboard/embedding",
  },
  { title: "Recent Chat", icon: UsersIcon, href: "/dashboard/recent-chat" },
];

const chatHistory = [
  "Ojash Gurung - Whats best thing about you?",
  "MS Dhoni - Whats best thing about you?",
  "Virat Kohli - Whats best thing about you?",
  "Steve Smith - Whats best thing about you?",
];

export function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };
  return (
    <div className="w-[280px] border-r h-screen flex flex-col bg-gray-50">
      <div className="flex flex-col h-full">
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-full" />
            <h1 className="text-xl font-semibold text-indigo-600">selfAI.</h1>
          </div>

          <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search for chats..."
              className="pl-9 bg-white"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
            >
              <Command className="w-4 h-4" />
            </Button>
          </div>

          <nav className="space-y-1 mb-2 text-sm">
            {menuItems.map((item) => (
              <div key={item.title}>
                {item.subItems ? (
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50",
                      pathname.startsWith(item.href) &&
                        "bg-gray-50 text-gray-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.title}
                    </div>
                    {openMenus.includes(item.title) ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </button>
                ) : (
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
                )}
                {item.subItems && openMenus.includes(item.title) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className={cn(
                          "block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md",
                          pathname === subItem.href &&
                            "bg-gray-50 text-gray-900"
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

        <div className="flex-1 overflow-hidden px-4">
          <div className="relative">
            <h3 className="text-xs font-normal text-gray-400 px-2 mb-2">
              CHAT HISTORY
            </h3>
            <div className="space-y-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent max-h-[calc(100vh-450px)]">
              {chatHistory.map((chat) => (
                <button
                  key={chat}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 rounded-md truncate"
                >
                  {chat}
                </button>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="border-t p-4 mt-4">
          <DropdownMenu>
            <div className="w-full ">
              <div className="flex items-center gap-3 p-2 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center">
                  <span className="text-indigo-700 font-medium">FP</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-left">Fandaww Punx</p>
                </div>
                <DropdownMenuTrigger>
                  <Settings className="w-5 h-5 mr-2 text-gray-500 hover:text-black transition-colors" />
                </DropdownMenuTrigger>
              </div>
            </div>

            <DropdownMenuContent
              className="w-56 bg-white shadow-lg border border-gray-200"
              align="end"
              side="right"
              sideOffset={12}
              alignOffset={40}
            >
              <DropdownMenuItem className="hover:bg-gray-50">
                <User className="w-4 h-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50">
                <Settings className="w-4 h-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem className="text-red-600 hover:bg-red-50 hover:text-red-700">
                <LogOut className="w-4 h-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
