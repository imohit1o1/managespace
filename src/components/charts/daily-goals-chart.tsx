"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import { DatePickerWithRange } from "@/components/date-picker-range";
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

export function DailyGoalsChart() {
  return (
    <Card className="border-3 border-sky-450 w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="block">Daily Goals</CardTitle>
          <CardDescription className="block">
            January - June 2024
          </CardDescription>
        </div>
        <DatePickerWithRange />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-40 w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              // dataKey="date"
              tickLine={false}
              axisLine={false}
              // tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="studied"
              type="monotone"
              stroke="var(--color-studied)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="assigned"
              type="monotone"
              stroke="var(--color-assigned)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Growing up by 5.2% this date <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing your daily goals achievement for the last 7 dates
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
