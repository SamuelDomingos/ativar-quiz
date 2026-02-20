"use client";

import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Label,
} from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

type RadialChartData = {
  label: string;
  value: number;
  fill?: string;
};

type ChartRadialTextProps = {
  data: RadialChartData[];
  config: ChartConfig;
  centerLabel?: string;
};

export function ChartRadialText({
  data,
  config,
  centerLabel,
}: ChartRadialTextProps) {
  const value = data?.[0]?.value ?? 0;

  return (
    <ChartContainer config={config} className="mx-auto aspect-square h-30">
      <RadialBarChart
        data={data}
        innerRadius={50}
        outerRadius={80}
        startAngle={100}
        endAngle={-270}
      >
        <PolarGrid gridType="circle" radialLines={false} stroke="none" />

        <RadialBar dataKey="value" cornerRadius={12} background />

        <PolarRadiusAxis tick={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox)) return null;

              return (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan className="text-4xl font-bold fill-foreground">
                    {value}
                  </tspan>

                  {centerLabel && (
                    <tspan
                      x={viewBox.cx}
                      dy={22}
                      className="fill-muted-foreground text-sm"
                    >
                      {centerLabel}
                    </tspan>
                  )}
                </text>
              );
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
