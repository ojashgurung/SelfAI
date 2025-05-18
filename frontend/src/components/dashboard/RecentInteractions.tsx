import { Card } from "@/components/ui/card";
import { ChatService } from "@/lib/service/chat.service";
import { useEffect, useState } from "react";
import { RecentInteractionProps } from "@/types/chat";

export function RecentInteractions() {
  const [interactions, setInteractions] = useState<RecentInteractionProps[]>(
    []
  );
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
  return (
    <Card className="p-6 bg-white rounded-3xl h-[440px] 2xl:h-[480px]">
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-semibold mb-2">Recent Interactions</h3>
        <p className="text-sm 2xl:text-base text-gray-500 mb-6">
          Here's who recently chatted with your SelfAI.
        </p>
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
        <button className="mt-auto text-sm 2xl:text-base text-indigo-600 hover:text-indigo-700 font-medium">
          View all chats
        </button>
      </div>
    </Card>
  );
}
