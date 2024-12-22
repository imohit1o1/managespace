"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  FileText,
  Image as ImageIcon,
  Video,
  Trash2,
  CircleAlert,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Chart data with storage categories, files count, and Lucide icons
const chartData = [
  {
    category: "Documents",
    icon: <FileText className="w-5 h-5" />,
    size: 11.45,
    color: "hsl(var(--chart-1))",
    filesCount: 121, // Number of files in this category
  },
  {
    category: "Images",
    icon: <ImageIcon className="w-5 h-5" />,
    size: 6.24,
    color: "hsl(var(--chart-2))",
    filesCount: 411,
  },
  {
    category: "Videos",
    icon: <Video className="w-5 h-5" />,
    size: 5.61,
    color: "hsl(var(--chart-3))",
    filesCount: 22,
  },
  {
    category: "Trash",
    icon: <Trash2 className="w-5 h-5" />,
    size: 1.5,
    color: "hsl(var(--chart-4))",
    filesCount: 12,
  },
  {
    category: "Others",
    icon: <CircleAlert className="w-5 h-5" />,
    size: 1,
    color: "hsl(var(--chart-5))",
    filesCount: 12,
  },
];

export function StorageChart() {
  const totalStorage = 50; // Total storage limit in GB
  const totalUsed = chartData.reduce((sum, item) => sum + item.size, 0);

  // Percentage of storage used
  const progressValue = (totalUsed / totalStorage) * 100;

  // Available storage
  const availableStorage = (totalStorage - totalUsed).toFixed(2);

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Storage Usage</CardTitle>
        <CardDescription>
          {totalUsed.toFixed(2)} GB used of {totalStorage.toFixed(2)} GB
        </CardDescription>
        <Progress value={progressValue} />
      </CardHeader>
      <CardContent className="space-y-4">
        {chartData.map((item, index) => {
          const progressValue = (item.size / totalStorage) * 100;

          return (
            <div key={index} className="flex items-center gap-4">
              {/* Icon with dynamic color */}
              <span
                className="flex items-center border p-2 rounded-md"
                style={{ color: item.color }} // Apply the color dynamically
              >
                {item.icon}
              </span>

              {/* Category and Files Count */}
              <div className="flex flex-col">
                <span className="w-24 text-sm font-medium">
                  {item.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.filesCount} Files
                </span>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 relative h-2 bg-muted rounded-lg">
                <div
                  className="absolute top-0 left-0 h-full rounded-lg transition-all duration-500"
                  style={{
                    width: `${progressValue}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>

              {/* Size Text */}
              <span className="text-sm font-medium">
                {item.size.toFixed(2)} GB
              </span>
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <div className="text-sm font-medium">
          Total available: {availableStorage} GB
        </div>
      </CardFooter>
    </Card>
  );
}
