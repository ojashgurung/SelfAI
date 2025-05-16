"use client";

import { Card } from "@/components/ui/card";
import { analyticsService } from "@/lib/service/analytics.service";
import { useState, useEffect } from "react";

export function DashboardHighlightCard() {
  const [highlightData, setHighlightData] = useState({
    label: "Loading...",
    stat: "",
    description: "Loading your highlights....",
  });

  useEffect(() => {
    const fetchHighlightData = async () => {
      try {
        const highlight = await analyticsService.getHighlights();
        setHighlightData(highlight);
      } catch (error) {
        console.error("Failed to fetch highlight data:", error);
        setHighlightData({
          label: "Error",
          stat: "",
          description: "Failed to load analytics",
        });
      }
    };
    fetchHighlightData();
  }, []);

  return (
    <Card className="p-6 bg-indigo-600 text-white rounded-3xl relative overflow-hidden h-[280px] 2xl:h-[300px]">
      {/* Animation */}
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
            {highlightData.label}
          </span>
          <div className="w-8 h-8 2xl:[w-10 h-10] rounded-full bg-indigo-500 bg-opacity-30 flex items-center justify-center">
            <div className="w-4 h-4 2xl:w-6 2xl:h-6 rounded-full bg-white" />
          </div>
        </div>
        <div>
          <h3 className="xl:text-xl 2xl:text-2xl font-semibold">
            {highlightData.description}
            {highlightData.stat && (
              <span className="font-bold"> ({highlightData.stat})</span>
            )}
          </h3>
        </div>
      </div>
    </Card>
  );
}
