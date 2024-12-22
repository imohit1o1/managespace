"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { date: "17-12-2024", studied: 10, assigned: 12 },
  { date: "18-12-2024", studied: 8, assigned: 7 },
  { date: "19-12-2024", studied: 4, assigned: 6 },
  { date: "20-12-2024", studied: 7, assigned: 6 },
  { date: "21-12-2024", studied: 9, assigned: 10 },
  { date: "22-12-2024", studied: 4, assigned: 1 },
];

const chartConfig = {
  studied: {
    label: "Studied",
    color: "hsl(var(--chart-2))",
  },
  assigned: {
    label: "Assigned",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function DailyGoals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-40 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              //   tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              // dataKey="date"
            //   tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="studied"
              type="natural"
              fill="var(--color-studied)"
              fillOpacity={0.4}
              stroke="var(--color-studied)"
              stackId="a"
            />
            <Area
              dataKey="assigned"
              type="natural"
              fill="var(--color-assigned)"
              fillOpacity={0.4}
              stroke="var(--color-assigned)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
