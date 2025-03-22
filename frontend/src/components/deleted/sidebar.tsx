"use client";

import { cn } from "@/lib/utils/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  GlobeIcon,
  UsersIcon,
  FileTextIcon,
  FileIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Settings,
  LogOut,
  User,
} from "lucide-react";

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

      <nav className="space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.subItems ? (
              <button
                onClick={() => toggleMenu(item.title)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50",
                  pathname.startsWith(item.href) && "bg-gray-50 text-gray-900"
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
      <div className="border-t pt-4 mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-lime-200 flex items-center justify-center">
                <span className="text-lime-700 font-medium">FP</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Fandaww Punx</p>
                <p className="text-xs text-gray-500">fandawwG@gmail.com</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-white shadow-lg border border-gray-200"
            align="end"
            side="top"
            sideOffset={12}
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
  );
}
