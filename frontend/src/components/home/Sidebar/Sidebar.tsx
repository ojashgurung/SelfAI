"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  UsersIcon,
  Plus,
  LayoutTemplate,
  GitFork,
  PanelLeftClose,
  PanelLeftOpen,
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
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  const handleLogoutClick = () => setShowLogoutDialog(true);

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setShowLogoutDialog(false);
      router.replace("/signin");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  useEffect(() => {
    const checkData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/has-data`,
          { credentials: "include" },
        );
        const data = await response.json();
        setHasData(data.has_data);
      } catch (error) {
        console.error("Failed to check data status:", error);
      }
    };
    if (user) checkData();
  }, [user]);

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
          router.push("/signin");
          return;
        }
        if (isMounted) {
          setMasterSession(null);
          setChatHistory([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [user, router]);

  const menuItems = [
    { title: "Context", icon: GitFork, href: "/context", disabled: false },
    { title: "Compare", icon: Sparkles, href: "/compare", disabled: !hasData },
    {
      title: "Chat",
      icon: UsersIcon,
      href: `/chat/${masterSession?.id}`,
      disabled: !hasData,
    },
    {
      title: "Widget",
      icon: LayoutTemplate,
      href: "/widget",
      disabled: !hasData,
      matchPaths: ["/widget", "/widget/configuration"],
    },
  ];

  const isActive = (item: (typeof menuItems)[0]) =>
    pathname === item.href ||
    item.matchPaths?.some((p) => pathname.startsWith(p));

  const handleNavClick = (e: React.MouseEvent, item: (typeof menuItems)[0]) => {
    if (item.disabled) {
      e.preventDefault();
      router.push("/context");
      toast.error("Connect a data source first", {
        description: "Head to Context to connect GitHub or upload a document.",
      });
    }
  };

  return (
    <>
      <div
        className={cn(
          "h-screen flex flex-col transition-all duration-300 ease-in-out flex-shrink-0",
          "bg-[#0a0a0a] border-r border-white/[0.06]",
          collapsed ? "w-[56px]" : "w-[240px]",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={cn(
              "flex items-center transition-all duration-300 pt-4 pb-2",
              collapsed ? "justify-center px-3" : "justify-between px-4",
            )}
          >
            {!collapsed && <Logo href="/context" compact={false} />}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-7 h-7 rounded-md flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-150"
            >
              {collapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {collapsed && (
            <div className="flex justify-center pb-3 px-3">
              <Logo href="/context" compact={true} />
            </div>
          )}

          {/* Divider */}
          <div className="mx-3 h-px bg-white/[0.06] mb-2" />

          {/* Nav items */}
          <nav className="px-2 space-y-0.5 flex-shrink-0">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.disabled ? "#" : item.href}
                title={collapsed ? item.title : undefined}
                onClick={(e) => handleNavClick(e, item)}
                className={cn(
                  "group flex items-center gap-2.5 rounded-md transition-all duration-150",
                  collapsed ? "justify-center p-2" : "px-2.5 py-1.5",
                  item.disabled && "cursor-not-allowed opacity-25",
                  isActive(item)
                    ? "bg-white text-[#0a0a0a]"
                    : !item.disabled
                      ? "text-white/45 hover:text-white hover:bg-white/[0.06]"
                      : "text-white/25",
                )}
              >
                <item.icon
                  className={cn(
                    "flex-shrink-0 transition-all duration-150",
                    collapsed ? "w-4 h-4" : "w-3.5 h-3.5",
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="text-sm font-medium tracking-wide flex-1">
                      {item.title}
                    </span>
                    {item.disabled && (
                      <span className="text-[10px] text-white/20">locked</span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="mx-3 h-px bg-white/[0.06] mt-2 mb-2" />

          {/* Chat history */}
          <div className="flex-1 overflow-hidden px-2 min-h-0">
            {!collapsed && (
              <div className="flex items-center justify-between px-2 mb-1.5">
                <span className="text-xs font-semibold tracking-widest text-white/20 uppercase">
                  History
                </span>
                <button
                  onClick={() => setShowShareDialog(true)}
                  className="w-5 h-5 rounded flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/[0.06] transition-all"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="space-y-0.5 overflow-y-auto max-h-[calc(100vh-380px)] scrollbar-none">
              {chatHistory.length === 0 && !collapsed && (
                <p className="text-xs text-white/20 px-2 py-1">
                  No history yet
                </p>
              )}
              {chatHistory.map((session, index) => (
                <Link
                  key={session.id || `session-${index}`}
                  href={`/chat/${session.id}`}
                  title={collapsed ? session.owner_name : undefined}
                  className={cn(
                    "flex items-center rounded-md transition-all duration-150",
                    collapsed ? "justify-center p-2" : "px-2 py-1.5",
                    pathname === `/chat/${session.id}`
                      ? "bg-white/[0.08] text-white"
                      : "text-white/25 hover:text-white/55 hover:bg-white/[0.04]",
                  )}
                >
                  {collapsed ? (
                    <span className="text-[10px] font-bold">
                      {session.owner_name.substring(0, 2).toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-[11px] truncate">
                      {session.messages && session.messages.length > 0
                        ? session.messages[0].content.substring(0, 28) + "..."
                        : session.owner_name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* User footer */}
          <div className="flex-shrink-0 border-t border-white/[0.06] p-2">
            {user ? (
              <UserDropdown
                user={user}
                onLogout={handleLogoutClick}
                style=""
                withIcon={!collapsed}
                minimized={collapsed}
                align={collapsed ? "center" : "end"}
                side="right"
                sideOffset={8}
                alignOffset={0}
              />
            ) : (
              <div className="h-8 bg-white/[0.04] rounded-md animate-pulse" />
            )}
          </div>
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
