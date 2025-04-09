"use client";

import { ResponsiveLine } from "@nivo/line";

const chartData = [
  {
    id: "Views",
    color: "hsl(252, 100%, 67%)", // Purple-ish
    data: [
      { x: "9 Jan", y: 20 },
      { x: "10 Jan", y: 45 },
      { x: "19 Jan", y: 10 },
      { x: "20 Jan", y: 45 },
      { x: "21 Jan", y: 20 },
      { x: "22 Jan", y: 45 },
      { x: "27 Jan", y: 20 },
      { x: "30 Jan", y: 45 },
    ],
  },
];

export function ModernLineChart() {
  return (
    <div className="h-[220px] 2xl:h-[260px]">
      <ResponsiveLine
        data={chartData}
        margin={{ top: 10, right: 20, bottom: 40, left: 40 }} // ⬅️ increased bottom margin
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
          tickValues: [0, 10, 20, 30, 40, 50, 60],
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
        areaBaselineValue={0} // ⬅️ This ensures area starts from 0 instead of y-min
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
                <span style={{ color: point.serieColor }}>
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
