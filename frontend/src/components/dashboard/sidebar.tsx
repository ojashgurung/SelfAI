"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  HomeIcon,
  GlobeIcon,
  UsersIcon,
  FileTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Search,
  Command,
  Plus,
  LayoutTemplate,
} from "lucide-react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LogoutDialog } from "@/components/dialog/logout-dialog";
import { ShareLinkDialog } from "@/components/dialog/share-link-dialog";
import { UserDropdown } from "@/components/dropdown/user-dropdown";
import { ChatService } from "@/lib/service/chat.service";

interface ChatSession {
  id: string;
  user_id?: string;
  visitor_id?: string;
  share_token?: string;
  created_at: string;
  updated_at: string;
  messages: Array<{
    id: string;
    session_id: string;
    content: string;
    role: string;
    created_at: string;
  }>;
  namespace: string;
  title: string;
  is_public: boolean;
}

export function Sidebar() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const [masterSession, setMasterSession] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setShowLogoutDialog(false);
      router.replace("/auth/signin");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  const handleJoinChat = async () => {
    try {
      setShowShareDialog(false);
    } catch (error) {
      console.error("Failed to join chat:", error);
    }
  };

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user || !user.id || isLoading) return;
      setIsLoading(true);

      try {
        // Fetch both in parallel
        const [masterResult, historyResult] = await Promise.all([
          ChatService.getMasterSession(),
          ChatService.getChatHistory(),
        ]);

        if (isMounted) {
          setMasterSession(masterResult);
          setChatHistory(historyResult || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (error instanceof Error && error.message.includes("Unauthorized")) {
          router.push("/auth/signin");
          return;
        }
        if (isMounted) {
          setMasterSession(null);
          setChatHistory([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user, router]);

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
      title: "Upload & Train",
      icon: FileTextIcon,
      href: "/dashboard/document",
    },
    {
      title: "Create Widget",
      icon: LayoutTemplate,
      href: masterSession?.id ? "/dashboard/widget" : "/dashboard/document",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!masterSession?.id) {
          e.preventDefault();
          toast.error(
            "Please upload and train a document before creating a widget"
          );
          return;
        }
        e.preventDefault(); // Prevent default even for valid navigation
        router.push("/dashboard/widget");
      },
    },
    {
      title: "Own Trained Chat",
      icon: UsersIcon,
      href: masterSession?.id
        ? `/dashboard/chat/${masterSession.id}`
        : "/dashboard/document",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!masterSession?.id) {
          e.preventDefault();
          toast.error("Please upload and train a document first");
          return;
        }
        e.preventDefault();
        router.push(`/dashboard/chat/${masterSession.id}`);
      },
    },
  ];
  return (
    <>
      <div className="w-[280px] border-r h-screen flex flex-col bg-gray-50">
        <div className="flex flex-col h-full">
          <div className="p-4 flex-shrink-0">
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 100 120"
                className="text-indigo-600"
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
                          "bg-indigo-50 text-indigo-600 font-extrabold"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "w-5 h-5 transition-colors duration-200",
                            pathname.startsWith(item.href) &&
                              "text-indigo-600 font-extrabold"
                          )}
                        />
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
                      onClick={item.onClick}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 transition-all duration-200 ease-in-out",
                        (pathname === item.href ||
                          (!masterSession?.id &&
                            item.href === "/dashboard/document" &&
                            ["/dashboard/widget", "/dashboard/chat"].some((p) =>
                              pathname.startsWith(p)
                            ))) &&
                          "p-3 bg-indigo-50 text-indigo-600 font-bold"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5 transition duration-200",
                          (pathname === item.href ||
                            (!masterSession?.id &&
                              item.href === "/dashboard/document" &&
                              ["/dashboard/widget", "/dashboard/chat"].some(
                                (p) => pathname.startsWith(p)
                              ))) &&
                            "w-6 h-6 text-indigo-600 font-bold"
                        )}
                      />
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
                              "bg-gray-50 text-gray-900 font-extrabold"
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
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-xs font-normal text-gray-400">
                CHAT HISTORY
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
                onClick={() => setShowShareDialog(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent max-h-[calc(100vh-450px)]">
              {chatHistory.map((session) => (
                <Link
                  key={session.id}
                  href={`/dashboard/chat/${session.id}`}
                  className="block w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 rounded-md truncate bg-transparent"
                >
                  {"User " +
                    session.user_id?.slice(0, 5) +
                    " - " +
                    session.messages[0]?.content?.slice(0, 16) +
                    "..." || "Untitled Chat"}
                </Link>
              ))}
            </div>
          </div>

          {user ? (
            <div className="relative z-50 bg-gray-50 border-t">
              <UserDropdown user={user} onLogout={handleLogoutClick} />
            </div>
          ) : (
            <div className="p-4 border-t">
              <div className="animate-pulse h-10 bg-gray-100 rounded-md" />
            </div>
          )}
        </div>
      </div>
      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogoutConfirm}
        email={user?.email || ""}
      />
      <ShareLinkDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        onJoin={handleJoinChat}
      />
    </>
  );
}
