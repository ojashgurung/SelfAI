"use client";

import { Card } from "@/components/ui/card";
import { analyticsService } from "@/lib/service/analytics.service";
import { useState, useEffect } from "react";

import { MoreHorizontal, MailIcon, ShieldCheckIcon } from "lucide-react";

export function ProfileCompletion() {
  const [profileCompletionData, setProfileCompletionData] =
    useState<ProfileCompletionProps | null>();

  useEffect(() => {
    const fetchProfileCompletionData = async () => {
      try {
        const profileCompletionStats =
          await analyticsService.getProfileCompletionStatus();
        setProfileCompletionData(profileCompletionStats);
      } catch (error) {
        console.error("Failed to fetch highlight data:", error);
      }
    };
    fetchProfileCompletionData();
  }, []);

  const getAchievementMessage = (score?: number) => {
    if (score === undefined) return "Loading...";
    if (score >= 95) return "🎉 You're all set!";
    if (score >= 70) return "🚀 You're almost there!";
    if (score >= 50) return "🔥 Great progress!";
    if (score >= 30) return "📈 You're getting started!";
    return "Let’s build your profile!";
  };

  const score = profileCompletionData?.completion_score ?? 0;

  const badgeClass =
    score >= 95
      ? "bg-yellow-100 text-yellow-800"
      : score >= 80
        ? "bg-green-100 text-green-800"
        : score >= 60
          ? "bg-blue-100 text-blue-800"
          : "bg-gray-100 text-gray-800";

  const achievementMessage = getAchievementMessage(
    profileCompletionData?.completion_score
  );

  return (
    <Card className="p-6 bg-white rounded-3xl h-[280px] 2xl:h-[300px]">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Profile Completion
          </h3>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-4xl font-medium 2xl:font-bold">
              {profileCompletionData?.completion_score}%
            </span>
            <div
              className={`text-xs 2xl:text-sm p-2 px-5 rounded-full  ${badgeClass}`}
            >
              {achievementMessage}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex h-2 rounded-full overflow-hidden gap-1">
              <div className="w-[42%] bg-indigo-200 h-full rounded-full">
                <div
                  className="z-1 bg-indigo-600 h-full rounded-full"
                  style={{
                    width: `${profileCompletionData?.sections[0].percent}%`,
                  }}
                />
              </div>
              <div className="w-[34%] bg-orange-200 h-full rounded-full">
                <div
                  className="z-1 bg-orange-600 h-full rounded-full"
                  style={{
                    width: `${profileCompletionData?.sections[1].percent}%`,
                  }}
                />
              </div>
              <div className="w-[24%] bg-gray-200 h-full rounded-full">
                <div
                  className="z-1 bg-gray-600 h-full rounded-full"
                  style={{
                    width: `${profileCompletionData?.sections[2].percent}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex">
              <div className="flex items-center gap-2 w-[42%]">
                <div className="w-2 h-2 pl-1 bg-indigo-600 rounded-full" />

                <span className="text-xs 2xl:text-sm text-gray-500 w-full">
                  {profileCompletionData?.sections[0].label}
                </span>
              </div>
              <div className="flex items-center gap-2 w-[34%]">
                <div className="w-2 h-2 pl-1 bg-orange-600 rounded-full" />
                <span className="text-xs 2xl:text-sm text-gray-500 w-full">
                  {profileCompletionData?.sections[1].label}
                </span>
              </div>
              <div className="flex items-center gap-2 w-[24%]">
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                <span className="text-xs 2xl:text-sm text-gray-500 w-full">
                  {profileCompletionData?.sections[2].label}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-sm 2xl:text-base text-gray-500">
            Secure your account further by:
          </div>

          <div className="flex items-center gap-4">
            <button className="flex rounded-full border border-gray-200 py-2 px-4 items-center gap-2">
              <MailIcon className="w-4 h-4 2xl:w-6 2xl:h-6  text-gray-400" />
              <span className="text-sm  text-gray-600">Verify email</span>
            </button>
            <button className="flex rounded-full border border-gray-200 py-2 px-4 items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 2xl:w-6 2xl:h-6  text-gray-400" />
              <span className="text-sm text-gray-600">Enable 2FA</span>
            </button>
            <button className="ml-auto border border-gray-200 p-2 rounded-full">
              <MoreHorizontal className="w-4 h-4 2xl:w-6 2xl:h-6  text-xl text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
