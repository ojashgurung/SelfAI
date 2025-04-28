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
import { Logo } from "../logo/Logo";

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
      title: "Connect & Train",
      icon: GlobeIcon,
      href: "/dashboard/connections",
      disabled: true,
      subItems: [
        {
          title: "Connect LinkedIn",
          href: "/dashboard/connections/linkedin",
          disabled: true,
        },
        {
          title: "Comment GitHub",
          href: "/dashboard/connections/github",
          disabled: true,
        },
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
      disabled: !masterSession?.id,
      href: "/dashboard/widget",
      matchPaths: ["/dashboard/widget", "/dashboard/widget/configuration"],
    },
    {
      title: "Own Trained Chat",
      icon: UsersIcon,
      disabled: !masterSession?.id,
      href: `/dashboard/chat/${masterSession?.id}`,
    },
  ];
  return (
    <>
      <div className="w-[280px] border-r h-screen flex flex-col bg-gray-50">
        <div className="flex flex-col h-full">
          <div className="p-4 flex-shrink-0">
            <div className="flex items-center mb-4">
              <Logo href="/dashboard" />
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
                      disabled={item.disabled}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-md ",
                        item.disabled
                          ? "text-gray-400 cursor-not-allowed hover:bg-transparent"
                          : "text-gray-600 hover:bg-gray-50",
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
                      {item.disabled && (
                        <span className="text-xs bg-amber-500  text-white px-2 py-0.5 rounded">
                          Soon
                        </span>
                      )}
                      {openMenus.includes(item.title) ? (
                        <ChevronDownIcon className="w-4 h-4" />
                      ) : (
                        <ChevronRightIcon className="w-4 h-4" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (
                          !masterSession?.id &&
                          !item.href.includes("document") &&
                          item.href !== "/dashboard"
                        ) {
                          e.preventDefault();
                          router.push("/dashboard/document");
                          toast.error("Please upload a document first", {
                            description:
                              "You need to upload and train a document before accessing this feature.",
                          });
                        }
                      }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 transition-all duration-200 ease-in-out",
                        (pathname === item.href ||
                          item.matchPaths?.some((p) =>
                            pathname.startsWith(p)
                          ) ||
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
                            item.matchPaths?.some((p) =>
                              pathname.startsWith(p)
                            ) ||
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
