"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  BellIcon,
  ShareIcon,
  MoreHorizontal,
  CopyIcon,
  UserIcon,
  MailIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { ModernLineChart } from "@/components/ui/nivo-line-chart";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="px-6 py-4 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6 2xl:mb-10">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative w-10 h-10">
            <BellIcon className="w-4 h-4 2xl:w-6 2xl:h-6" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10">
            <CopyIcon className="w-4 h-4 2xl:w-6 2xl:h-6" />
          </Button>
          <div className="flex items-center gap-3 ml-2 border-l pl-4">
            <div className="flex flex-col items-end">
              <span className="text-sm 2xl:text-base font-medium">
                {user?.fullname || "Loading..."}
              </span>
              <span className="text-xs 2xl:text-sm text-gray-500">
                {user?.email || "Loading..."}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.fullname
                  ? user.fullname
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()
                  : "..."}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 2xl:gap-4">
        {/* First Row */}
        <div className="col-span-3">
          <Card className="p-6 bg-indigo-600 text-white rounded-3xl relative overflow-hidden h-[280px] 2xl:h-[300px]">
            <div className="absolute inset-0 w-full h-full">
              <svg
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full"
              >
                <circle
                  cx="300"
                  cy="100"
                  r="250"
                  stroke="white"
                  strokeOpacity="0.1"
                  strokeWidth="2"
                  className="animate-[spin_30s_linear_infinite]"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="white"
                  strokeOpacity="0.1"
                  strokeWidth="2"
                  className="animate-[spin-reverse_20s_linear_infinite]"
                />
                <circle
                  cx="120"
                  cy="10"
                  r="120"
                  stroke="white"
                  strokeOpacity="0.1"
                  strokeWidth="2"
                  className="animate-[spin_40s_linear_infinite]"
                />
                <circle
                  cx="350"
                  cy="200"
                  r="40"
                  stroke="white"
                  strokeOpacity="0.1"
                  strokeWidth="2"
                  className="animate-[spin-reverse_36s_linear_infinite]"
                />
                <circle
                  cx="350"
                  cy="200"
                  r="16"
                  stroke="white"
                  strokeOpacity="0.1"
                  strokeWidth="2"
                  className="animate-[spin-reverse_22s_linear_infinite]"
                />
                <circle
                  cx="300"
                  cy="260"
                  r="12"
                  stroke="white"
                  strokeOpacity="0.1"
                  strokeWidth="2"
                  className="animate-[spin-reverse_22s_linear_infinite]"
                />

                <path
                  d="M50,400 C150,250 250,250 350,400"
                  stroke="white"
                  strokeOpacity="0.1"
                  strokeWidth="2"
                  fill="none"
                  className="animate-[fadeIn_5s_ease-in-out_infinite]"
                />
              </svg>
            </div>
            <div className="z-10 flex flex-col justify-between h-full py-2 gap-4 2xl:gap-2">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-indigo-500 bg-opacity-30 rounded-full text-sm 2xl:text-base 2xl:py-2 2xl:px-4">
                  Findings
                </span>
                <div className="w-8 h-8 2xl:[w-10 h-10] rounded-full bg-indigo-500 bg-opacity-30 flex items-center justify-center">
                  <div className="w-4 h-4 2xl:w-6 2xl:h-6 rounded-full bg-white" />
                </div>
              </div>
              <div>
                <h3 className="xl:text-xl 2xl:text-2xl font-semibold">
                  Your AI Chatbot has answered 245 queries this week — up 18%
                  from last week.
                </h3>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-span-5">
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
                    87%
                  </span>
                  <div className="text-xs 2xl:text-sm bg-gray-100 p-2 px-5 rounded-full text-black">
                    You're Almost there!
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex h-2 rounded-full overflow-hidden gap-1">
                    <div className="w-[42%] h-full bg-indigo-600 rounded-full" />
                    <div className="w-[34%] h-full bg-orange-400 rounded-full" />
                    <div className="w-[24%] h-full bg-gray-200 rounded-full" />
                  </div>
                  <div className="flex">
                    <div className="flex items-center gap-2 w-[42%]">
                      <div className="w-2 h-2 pl-1 bg-indigo-600 rounded-full" />

                      <span className="text-xs 2xl:text-sm text-gray-500 w-full">
                        Uploaded Documents
                      </span>
                    </div>
                    <div className="flex items-center gap-2 w-[34%]">
                      <div className="w-2 h-2 pl-1 bg-orange-600 rounded-full" />
                      <span className="text-xs 2xl:text-sm text-gray-500 w-full">
                        Widgets
                      </span>
                    </div>
                    <div className="flex items-center gap-2 w-[24%]">
                      <div className="w-2 h-2 bg-gray-200 rounded-full" />
                      <span className="text-xs 2xl:text-sm text-gray-500 w-full">
                        Profile
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
        </div>
        <div className="col-span-4">
          <Card className="p-6 bg-white rounded-3xl h-[280px] 2xl:h-[300px]">
            <div className="flex flex-col h-full">
              <div className="mb-4 2xl:mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Connect with a SelfAI
                </h2>
                <p className="text-base text-gray-600">
                  Paste a SelfAI share link to chat with their profile.
                </p>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Enter SelfAI share link..."
                  className="w-full p-4 bg-gray-50 rounded-2xl text-gray-700 text-base outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <Button className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-white text-base font-medium">
                Start Chatting
              </Button>
            </div>
          </Card>
        </div>
        {/* Second Row */}
        <div className="col-span-8">
          <Card className="p-6 h-[440px] 2xl:h-[480px] flex flex-col bg-white rounded-3xl shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  SelfAI Performance Overview
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Weekly performance metrics
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm font-medium"
                >
                  Day
                </Button>
                <Button
                  size="sm"
                  className="text-sm font-medium bg-black text-white"
                >
                  Week
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm font-medium"
                >
                  Month
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm font-medium"
                >
                  Year
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-bold text-gray-900">1,542</h3>
                  <p className="text-xs 2xl:text-sm text-green-500">
                    ↑ 55% vs last period
                  </p>
                </div>
                <div>
                  <p className="text-sm 2xl:text-base text-gray-500">
                    Total Questions Answered
                  </p>
                  <p className="text-xs 2xl:text-sm text-gray-400">
                    questions answered by your SelfAI
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-bold text-gray-900">342</h3>
                  <p className="text-xs 2xl:text-sm text-green-500">
                    ↑ 26% vs last period
                  </p>
                </div>
                <div>
                  <p className="text-sm 2xl:text-base text-gray-500">
                    Unique Visitors
                  </p>
                  <p className="text-xs 2xl:text-sm text-gray-400">
                    different people chatted with your bot
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-gray-900">0.76s</h3>
                <div>
                  <p className="text-sm 2xl:text-base text-gray-500">
                    Average Response Time
                  </p>
                  <p className="text-xs 2xl:text-sm text-gray-400 flex items-center gap-1">
                    per response
                    <span className="text-purple-500 font-medium">
                      • blazing fast!
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <ModernLineChart />
            </div>
          </Card>
        </div>
        <div className="col-span-4">
          <Card className="p-6 bg-white rounded-3xl h-[440px] 2xl:h-[480px]">
            <div className="flex flex-col h-full">
              <h3 className="text-xl font-semibold mb-2">
                Recent Interactions
              </h3>
              <p className="text-sm 2xl:text-base text-gray-500 mb-6">
                Here's who recently chatted with your SelfAI.
              </p>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center">
                      <span className="text-white font-medium">AL</span>
                    </div>
                    <div>
                      <p className="text-sm 2xl:text-base font-medium">Alice</p>
                      <p className="text-xs 2xl:text-sm text-gray-500">
                        Asked about resume
                      </p>
                    </div>
                  </div>
                  <span className="text-xs 2xl:text-sm text-gray-500">
                    2h ago
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                      <span className="text-white font-medium">DA</span>
                    </div>
                    <div>
                      <p className="text-sm 2xl:text-base font-medium">David</p>
                      <p className="text-xs 2xl:text-sm text-gray-500">
                        Looked at portfolio
                      </p>
                    </div>
                  </div>
                  <span className="text-xs 2xl:text-sm text-gray-500">
                    5h ago
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white font-medium">BW</span>
                    </div>
                    <div>
                      <p className="text-sm 2xl:text-base font-medium">Bruce</p>
                      <p className="text-xs 2xl:text-sm text-gray-500">
                        Asked about education
                      </p>
                    </div>
                  </div>
                  <span className="text-xs 2xl:text-sm text-gray-500">
                    2h ago
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm 2xl:text-base font-medium">
                        Anyonge
                      </p>
                      <p className="text-xs 2xl:text-sm text-gray-500">
                        Chatted about skills
                      </p>
                    </div>
                  </div>
                  <span className="text-xs 2xl:text-sm text-gray-500">
                    8h ago
                  </span>
                </div>
              </div>

              <button className="mt-auto text-sm 2xl:text-base text-indigo-600 hover:text-indigo-700 font-medium">
                View all chats
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
