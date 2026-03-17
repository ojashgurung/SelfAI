"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BellIcon, ScanQrCode } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { HighlightCard } from "@/components/home/HighlightCard";
import { ProfileCompletion } from "@/components/home/ProfileCompletion";
import { ConnectChat } from "@/components/home/ConnectChat";
import { PerformanceOverview } from "@/components/home/PerformanceOverview";
import { RecentInteractions } from "@/components/home/RecentInteractions";
import { ShareDialog } from "@/components/dialog/share-dialog";
import { ChatService } from "@/lib/service/chat.service";
import { UserDropdown } from "@/components/dropdown/user-dropdown";
import { LogoutDialog } from "@/components/dialog/logout-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleShareClick = async () => {
    if (!user) {
      return;
    }
    try {
      const session = await ChatService.getMasterSession();

      if (!session || !session.share_token) {
        toast.error("Session not found", {
          description:
            "You need to upload and train a document before retrieving session to share.",
        });
        return; // Add early return to prevent setting share URL
      }

      setCurrentShareUrl(
        `${window.location.origin}/chat/public/${session.share_token}`,
      );
      setShareDialogOpen(true);
    } catch (error) {
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          toast.error("No document found", {
            description:
              "Please upload and train a document first to share your AI.",
          });
        } else {
          toast.error("Failed to get session", {
            description:
              "There was an error retrieving your session. Please try again.",
          });
        }
      }
      console.error("Failed to get master session:", error);
    }
  };

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
  return (
    <>
      <div className="px-6 py-4 bg-gray-50 min-h-full">
        <div className="flex justify-between items-center mb-6 2xl:mb-10">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* TODO: Notification after Websocket integration */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="relative w-10 h-10 transition-all duration-150 ease-in-out hover:scale-105"
            >
              <BellIcon className="w-4 h-4 2xl:w-6 2xl:h-6" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </Button> */}
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 transition-all duration-150 ease-in-out hover:scale-105"
              onClick={handleShareClick}
              title="Share your SelfAI"
            >
              <ScanQrCode className="w-4 h-4 2xl:w-6 2xl:h-6" />
            </Button>

            <div className="flex items-center gap-3 ml-2 border-l pl-4">
              {user ? (
                <div className="relative z-50 bg-gray-50 border-t">
                  <UserDropdown
                    user={user}
                    onLogout={handleLogoutClick}
                    style=""
                    withIcon={false}
                    reversed={true}
                    align="center"
                    side="bottom"
                    sideOffset={12}
                  />
                </div>
              ) : (
                <div className="p-4 border-t">
                  <div className="animate-pulse h-10 bg-gray-100 rounded-md" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2 2xl:gap-4">
          {/* First Row */}
          <div className="col-span-3">
            <HighlightCard />
          </div>
          <div className="col-span-5">
            <ProfileCompletion />
          </div>
          <div className="col-span-4">
            <ConnectChat />
          </div>
          {/* Second Row */}
          <div className="col-span-8">
            <PerformanceOverview />
          </div>
          <div className="col-span-4">
            <RecentInteractions />
          </div>
        </div>
      </div>
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        shareUrl={currentShareUrl}
      />
      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogoutConfirm}
        email={user?.email || ""}
      />
    </>
  );
}
