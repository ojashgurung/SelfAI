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
  FileIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Search,
  Command,
  Plus,
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

  const [ownerSessionId, setOwnerSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    router.push("/signin");
    setShowLogoutDialog(false);
  };

  const handleJoinChat = async (shareToken: string) => {
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
    const sessionId = localStorage.getItem("ownerSessionId");
    setOwnerSessionId(sessionId);
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "ownerSessionId") {
        setOwnerSessionId(e.newValue);
      }
    };

    const handleCustomStorage = (e: CustomEvent) => {
      setOwnerSessionId(e.detail);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "ownerSessionIdChange",
      handleCustomStorage as EventListener
    );
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "ownerSessionIdChange",
        handleCustomStorage as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const data = await ChatService.getChatHistory();

        setChatHistory(data);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };
    if (user) {
      fetchChatHistory();
    }
  }, [user]);

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
      title: "Own Trained Chat",
      icon: UsersIcon,
      href: ownerSessionId
        ? `/dashboard/chat/${ownerSessionId}`
        : "/dashboard/document",
      onClick: () => {
        if (!ownerSessionId) {
          toast.error("Please upload and train a document first");
        }
      },
    },
  ];
  return (
    <>
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
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 rounded-md truncate"
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
            <UserDropdown user={user} onLogout={handleLogoutClick} />
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
