"use client";

import { useState } from "react";
import { UserService } from "@/lib/service/user.service";
import { ChatService } from "@/lib/service/chat.service";
import { Button } from "@/components/ui/button";
import { PanelRight, PanelRightClose } from "lucide-react";
import { useChatSidebar } from "@/context/chat-sidebar-context";
import { ChatSession } from "@/types/chat";
import { ShareDialog } from "@/components/dialog/share-dialog";

interface ChatHeaderProps {
  isPublic?: boolean;
  session?: ChatSession;
}

export default function ChatHeader({ isPublic, session }: ChatHeaderProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { isChatSidebarOpen, toggleChatSidebar } = useChatSidebar();
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const handleShareClick = async () => {
    try {
      const user_data = await UserService.getCurrentUser();
      setIsCreatingSession(true);
      const session = await ChatService.createSession({
        namespace: user_data.user_id,
        title: "Owner",
        is_public: true,
      });

      setCurrentShareUrl(
        `${window.location.origin}/chat/public/${session.share_token}`
      );
      setShareDialogOpen(true);
    } catch (error) {
      console.error("Failed to create chat session:", error);
    } finally {
      setIsCreatingSession(false);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-medium">
              {session?.owner?.fullname
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "AI"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <h2 className="flex min-w-fit font-medium">
              {session?.owner?.fullname || "AI Assistant"}
            </h2>
            <div className="w-full items-center justify bg-purple-100 px-4 py-1 text-white rounded-lg">
              <span className="text-sm font-medium text-purple-600">
                {session?.owner?.personal_bio || "Personal AI Assistant"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session?.title !== "Owner" && (
            <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M12 5v14M5 12h14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-medium">Connect</span>
            </button>
          )}

          <div className="h-6 w-[1px] bg-gray-200 mx-2" />
          {session?.title === "Owner" && (
            <>
              <button className="p-2 hover:bg-gray-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="p-2 hover:bg-gray-50 rounded-lg"
                onClick={handleShareClick}
                disabled={isCreatingSession}
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleChatSidebar}
            className="lg:flex hidden"
          >
            {isChatSidebarOpen ? (
              <PanelRightClose className="h-5 w-5 text-gray-500" />
            ) : (
              <PanelRight className="h-5 w-5 text-gray-500" />
            )}
          </Button>
        </div>
      </div>
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        shareUrl={currentShareUrl}
      />
    </>
  );
}
