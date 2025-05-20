import { Card } from "@/components/ui/card";
import { ChatService } from "@/lib/service/chat.service";
import { useEffect, useState } from "react";
import { RecentInteractionProps } from "@/types/chat";
import { Plus, FilePlus, Share, ScanQrCode } from "lucide-react";
import { UploadDialog } from "@/components/dialog/upload-dialog";
import { ShareDialog } from "@/components/dialog/share-dialog";
import { useAuth } from "@/hooks/use-auth";

export function RecentInteractions() {
  const { user } = useAuth();
  const [interactions, setInteractions] = useState<RecentInteractionProps[]>(
    []
  );
  const [uploadOpen, setUploadOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState("");

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await ChatService.getRecentInteractions();
        setInteractions(response);
      } catch (error) {
        console.error("Failed to fetch recent interaction data:", error);
      }
    };
    fetchInteractions();
  }, []);

  const handleShareClick = async () => {
    if (!user) {
      return;
    }
    try {
      const session = await ChatService.getMasterSession();

      setCurrentShareUrl(
        `${window.location.origin}/chat/public/${session?.share_token}`
      );
      setShareDialogOpen(true);
    } catch (error) {
      console.error("Failed to create chat session:", error);
    }
  };
  return (
    <>
      <Card className="p-6 bg-white rounded-3xl h-[440px] 2xl:h-[480px]">
        <div className="flex flex-col h-full">
          <h3 className="text-xl font-semibold mb-2">Recent Interactions</h3>
          <p className="text-sm 2xl:text-base text-gray-500 mb-6">
            Here's who recently chatted with your SelfAI.
          </p>
          {interactions.length > 0 ? (
            <div className="space-y-6">
              {interactions.map((interaction) => (
                <div
                  className="flex items-center justify-between"
                  key={interaction.id}
                >
                  <div className="flex items-center gap-3">
                    {interaction?.visitor_profile_image ? (
                      <img
                        src={interaction.visitor_profile_image}
                        alt={interaction.visitor_name}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    ) : (
                      <span className="w-10 h-10 items-center justify-center flex rounded-full bg-violet-500 text-white font-medium">
                        {interaction?.visitor_name
                          ? interaction.visitor_name
                              .split(" ")
                              .map((name) => name[0])
                              .join("")
                              .toUpperCase()
                          : "..."}
                      </span>
                    )}

                    <div>
                      <p className="text-sm 2xl:text-base font-medium">
                        {interaction.visitor_name}
                      </p>
                      <p className="text-xs 2xl:text-sm text-gray-500">
                        {interaction.last_message.slice(0, 30)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs 2xl:text-sm text-gray-500">
                    {interaction.last_message_created_at} ago
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                className="border-2 border-dashed border-indigo-200 p-4 rounded-xl cursor-pointer w-full transition-all group relative overflow-hidden"
                onClick={handleShareClick}
              >
                <div className="flex flex-col items-center justify-center gap-3 group-hover:blur-sm transition-all">
                  <Share className="w-8 h-8 text-indigo-500" />
                  <div className="text-center">
                    <h3 className="font-semibold text-sm text-gray-700">
                      Share your Chatbot
                    </h3>
                    <p className="text-xs text-gray-500">
                      No recent interactions yet.<br></br> Your AI is live but
                      hasn’t received any chats.
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-indigo-50/30">
                  <div className="flex flex-col gap-2 items-center text-indigo-700">
                    <div className="rounded-full bg-indigo-700 p-2">
                      <ScanQrCode className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg">Share AI</span>
                  </div>
                </div>
              </button>
              <button
                className="border-2 border-dashed border-indigo-200 p-4 rounded-xl cursor-pointer w-full transition-all group relative overflow-hidden"
                onClick={() => setUploadOpen(true)}
              >
                <div className="flex flex-col items-center justify-center gap-3 group-hover:blur-sm transition-all">
                  <FilePlus className="w-8 h-8 text-indigo-500" />
                  <div className="text-center">
                    <h3 className="font-semibold text-sm text-gray-700">
                      Upload a document
                    </h3>
                    <p className="text-xs text-gray-500">
                      No recent interactions yet. <br></br>Your AI is live but
                      hasn’t received any chats.
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-indigo-50/30">
                  <div className="flex flex-col gap-2 items-center text-indigo-700">
                    <div className="rounded-full bg-indigo-700 p-2">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg">Upload File</span>
                  </div>
                </div>
              </button>
            </div>
          )}
          <button className="mt-auto text-sm 2xl:text-base text-indigo-600 hover:text-indigo-700 font-medium">
            View all chats
          </button>
        </div>
      </Card>
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        shareUrl={currentShareUrl}
      />
    </>
  );
}
