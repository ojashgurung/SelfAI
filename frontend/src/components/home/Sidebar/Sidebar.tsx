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
  ChevronLeftIcon,
  GitFork,
  PanelRightOpen,
  PanelRightClose,
  Sparkles,
} from "lucide-react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LogoutDialog } from "@/components/dialog/logout-dialog";
import { JoinChatDialog } from "@/components/dialog/join-chat-dialog";
import { UserDropdown } from "@/components/dropdown/user-dropdown";
import { ChatService } from "@/lib/service/chat.service";
import { Logo } from "../../logo/Logo";

interface ChatSession {
  namespace: string;
  title: string;
  is_public: boolean;
  id: string;
  user_id?: string;
  visitor_id?: string;
  share_token?: string;
  owner_name: string;
  created_at: string;
  updated_at: string;
  messages?: Array<{
    id: string;
    session_id: string;
    content: string;
    role: string;
    created_at: string;
  }>;
}

export function Sidebar() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [masterSession, setMasterSession] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user || !user.id || isLoading) return;
      setIsLoading(true);

      try {
        const [masterResult, historyResult] = await Promise.all([
          ChatService.getMasterSession(),
          ChatService.getChatHistory(),
        ]);

        if (isMounted) {
          setMasterSession(masterResult as ChatSession);
          setChatHistory((historyResult as ChatSession[]) || []);
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
    {
      title: "Context",
      icon: GitFork,
      href: "/context",
    },
    {
      title: "Compare",
      icon: Sparkles,
      href: "/compare",
    },
    {
      title: "Chat",
      icon: UsersIcon,
      disabled: !masterSession?.id,
      href: `/chat/${masterSession?.id}`,
    },
    {
      title: "Widget",
      icon: LayoutTemplate,
      disabled: !masterSession?.id,
      href: "/widget",
      matchPaths: ["/app/widget", "/app/widget/configuration"],
    },
  ];
  return (
    <>
      <div
        className={cn(
          "border-r h-screen flex flex-col bg-gray-50 transition-all duration-200",
          collapsed ? "w-[60px]" : "w-[280px]",
        )}
      >
        <div className="flex flex-col h-full">
          <div
            className={cn(
              "flex-shrink-0 transition-all duration-200",
              collapsed ? "p-2" : "p-4",
            )}
          >
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setCollapsed(!collapsed);
                  if (!collapsed) setOpenMenus([]);
                }}
              >
                {collapsed ? (
                  <PanelRightClose className="w-5 h-5 text-gray-500" />
                ) : (
                  <PanelRightOpen className="w-5 h-5 text-gray-500" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <Logo href="/app" compact={collapsed} />
            </div>

            {!collapsed && (
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
            )}

            <nav className="space-y-1 mb-2 text-sm">
              {menuItems.map((item) => (
                <div key={item.title}>
                  <Link
                    href={item.href}
                    title={collapsed ? item.title : undefined}
                    onClick={(e) => {
                      if (
                        !masterSession?.id &&
                        !item.href.includes("document") &&
                        item.href !== "/app"
                      ) {
                        e.preventDefault();
                        router.push("/context");
                        toast.error("Please connect a data source first", {
                          description:
                            "Connect GitHub or upload a document in Context first.",
                        });
                        item.href !== "/context";
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 py-2 rounded-md text-gray-600 transition-all duration-200 ease-in-out",
                      collapsed ? "justify-center px-2" : "px-3",
                      (pathname === item.href ||
                        item.matchPaths?.some((p) => pathname.startsWith(p)) ||
                        (!masterSession?.id &&
                          item.href === "/app/document" &&
                          ["/app/widget", "/app/chat"].some((p) =>
                            pathname.startsWith(p),
                          ))) &&
                        "p-3 bg-indigo-50 text-indigo-600 font-bold",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition duration-200",
                        (pathname === item.href ||
                          item.matchPaths?.some((p) =>
                            pathname.startsWith(p),
                          ) ||
                          (!masterSession?.id &&
                            item.href === "/app/document" &&
                            ["/app/widget", "/app/chat"].some((p) =>
                              pathname.startsWith(p),
                            ))) &&
                          "w-6 h-6 text-indigo-600 font-bold",
                      )}
                    />
                    {!collapsed && item.title}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex-1 overflow-hidden px-4">
            {!collapsed && (
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
            )}
            <div className="space-y-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent max-h-[calc(100vh-450px)]">
              {chatHistory.map((session) => (
                <div key={session.id} className="hover:text-indigo-600 ">
                  <Link
                    key={session.id}
                    href={`/app/chat/${session.id}`}
                    title={collapsed ? session.owner_name : undefined}
                    className={cn(
                      "block w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 rounded-md truncate bg-transparent",
                      collapsed && "text-center px-0",
                    )}
                  >
                    {!collapsed ? (
                      session.owner_name +
                      " - " +
                      (session.messages && session.messages.length > 0
                        ? session.messages[0].content.substring(0, 20) + "..."
                        : "No messages yet")
                    ) : (
                      <span className="text-xs font-bold text-gray-500">
                        {session.owner_name.substring(0, 2)}
                      </span>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {user ? (
            <div className="relative z-50 bg-gray-50 border-t">
              <UserDropdown
                user={user}
                onLogout={handleLogoutClick}
                style="p-4 mt-4 border-t"
                withIcon={!collapsed}
                minimized={collapsed}
                align={collapsed ? "center" : "end"}
                side="right"
                sideOffset={-20}
                alignOffset={50}
              />
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
      <JoinChatDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />
    </>
  );
}
