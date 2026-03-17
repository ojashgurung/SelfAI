import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModernLineChart } from "@/components/ui/nivo-line-chart";
import { useEffect, useState } from "react";
import { analyticsService } from "@/lib/service/analytics.service";
import {
  PerformanceOverviewProps,
  TrendDataResponse,
  ChartSeries,
  TrendDataItem,
} from "@/types/performanceOverview";

export function PerformanceOverview() {
  const [performanceData, setPerformanceData] =
    useState<PerformanceOverviewProps>({
      queries: {
        total_queries: 0,
        current: 0,
        previous: 0,
        growth: 0,
      },
      visitors: {
        total_visitors: 0,
        current: 0,
        previous: 0,
        growth: 0,
      },
      since: null,
    });
  const [trendData, setTrendData] = useState<TrendDataResponse | null>();
  const [chartData, setChartData] = useState<ChartSeries[]>([
    {
      id: "Views",
      color: "hsl(252, 100%, 67%)",
      data: [],
    },
  ]);
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [averageResponseTime, setAverageResponseTime] = useState<number>(0);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await analyticsService.getPerformanceOverview();
        setPerformanceData(response);
      } catch (error) {
        console.error("Failed to fetch highlight data:", error);
      }
    };
    fetchPerformanceData();
  }, []);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const data = await analyticsService.getMetricsTrend(period);
        const formattedData: ChartSeries = {
          id: "Views",
          color: "hsl(252, 100%, 67%)",
          data: data.data.map((item: TrendDataItem) => ({
            x: new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: period === "year" ? undefined : "numeric",
              year: period === "year" ? "2-digit" : undefined,
            }),
            y: item.visitors,
          })),
        };
        setTrendData(data);
        setChartData([formattedData]);
      } catch (error) {
        console.error("Failed to fetch highlight data:", error);
      }
    };
    fetchTrendData();
  }, [period]);

  useEffect(() => {
    const fetchAverageResponseTime = async () => {
      try {
        const response = await analyticsService.getMetricsAverageResponseTime();
        setAverageResponseTime(response);
      } catch (error) {
        console.error("Failed to fetch highlight data:", error);
      }
    };
    fetchAverageResponseTime();
  }, []);

  return (
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
            className={`text-sm font-medium text-white ${
              period === "week" ? "bg-black" : "bg-white text-black"
            } transition-colors hover:bg-black/70 hover:text-white`}
            onClick={() => setPeriod("week")}
          >
            Week
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`text-sm font-medium text-white ${
              period === "month" ? "bg-black" : "bg-white text-black"
            } transition-colors hover:bg-black/70 hover:text-white`}
            onClick={() => setPeriod("month")}
          >
            Month
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`text-sm font-medium text-white ${
              period === "year" ? "bg-black" : "bg-white text-black"
            } transition-colors hover:bg-black/70 hover:text-white`}
            onClick={() => setPeriod("year")}
          >
            Year
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-bold text-gray-900">
              {performanceData.queries.total_queries}
            </h3>
            <p
              className={`text-xs 2xl:text-sm ${
                performanceData.visitors.growth > 0
                  ? "text-green-500"
                  : performanceData.visitors.growth < 0
                    ? "text-red-500"
                    : "text-blue-500"
              }`}
            >
              {performanceData.visitors.growth > 0
                ? "↑"
                : performanceData.visitors.growth < 0
                  ? "↓"
                  : "•"}{" "}
              {performanceData.visitors.growth}% vs last period
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
            <h3 className="text-3xl font-bold text-gray-900">
              {performanceData.visitors.total_visitors}
            </h3>
            <p
              className={`text-xs 2xl:text-sm ${
                performanceData.visitors.growth > 0
                  ? "text-green-500"
                  : performanceData.visitors.growth < 0
                    ? "text-red-500"
                    : "text-blue-500"
              }`}
            >
              {performanceData.visitors.growth > 0
                ? "↑"
                : performanceData.visitors.growth < 0
                  ? "↓"
                  : "•"}{" "}
              {performanceData.visitors.growth}% vs last period
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
          <h3 className="text-3xl font-bold text-gray-900">
            {averageResponseTime}s
          </h3>
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
        <ModernLineChart
          chartData={chartData}
          minCount={trendData?.min_count || 0}
          maxCount={trendData?.max_count || 0}
        />
      </div>
    </Card>
  );
}
