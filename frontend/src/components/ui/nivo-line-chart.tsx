"use client";

import { ResponsiveLine } from "@nivo/line";
import { ChartSeries } from "@/types/performanceOverview";

interface ModernLineChartProps {
  chartData: ChartSeries[];
  minCount: number;
  maxCount: number;
}

export function ModernLineChart({
  chartData,
  minCount,
  maxCount,
}: ModernLineChartProps) {
  const tickCount = 7;
  const range = maxCount - minCount;
  const step = Math.ceil(range / (tickCount - 1));
  const tickValues = Array.from(
    { length: tickCount },
    (_, i) => minCount + i * step
  );
  return (
    <div className="h-[220px] 2xl:h-[260px]">
      <ResponsiveLine
        data={chartData}
        margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        curve="monotoneX"
        axisBottom={{
          tickSize: 0,
          tickPadding: 12,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: tickValues,
        }}
        enableGridX={false}
        gridYValues={7}
        colors={{ datum: "color" }}
        lineWidth={3}
        pointSize={5}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        enableArea={true}
        areaOpacity={0.15}
        areaBaselineValue={0}
        useMesh={true}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: "#6b7280",
                fontSize: "12px",
                fontWeight: "500",
              },
            },
            domain: {
              line: {
                stroke: "transparent",
              },
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
              strokeWidth: 1,
            },
          },
          tooltip: {
            container: {
              background: "#fff",
              color: "#111",
              fontSize: 12,
              borderRadius: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: "8px 12px",
            },
          },
        }}
        enableSlices="x"
        sliceTooltip={({ slice }) => (
          <div
            style={{
              background: "white",
              padding: "9px 12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          >
            {slice.points.map((point) => (
              <div key={point.id}>
                <span style={{ color: "hsl(252, 100%, 67%)" }}>
                  {point.data.yFormatted}
                </span>{" "}
                views
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
}
