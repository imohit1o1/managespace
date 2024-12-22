"use client";
import { DailyGoalsChart } from "@/components/charts/daily-goals-chart";
import { StorageChart } from "@/components/charts/storage-chart";
import { TaskProgressChart } from "@/components/charts/task-progress-chart";
import { Card } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import React from "react";

export default function UserDashboard() {
  const { user } = useCurrentUser();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/*Greetings */}
      Hi, {user?.name || user?.username}
      <section className="grid auto-rows-min lg:grid-cols-3 gap-4">
        {/* Tabs section */}
        <div className="grid gap-4 col-span-2 ">
          <section className="grid gap-2 md:grid-cols-3 max-h-min">
            <Card className="p-4">
              Notes
              <div className="flex flex-col gap-2">
                <span>Total Notes: 5,</span>
              </div>
            </Card>
            <Card className="p-4">
              Notes
              <div className="flex flex-col gap-2">
                <span>Total Notes: 5,</span>
              </div>
            </Card>
            <Card className="p-4">
              Notes
              <div className="flex flex-col gap-2">
                <span>Total Notes: 5,</span>
              </div>
            </Card>
          </section>
          {/* <DailyGoals /> */}
          <DailyGoalsChart />
        </div>

        {/* Storage Details*/}
        <div className="">
          {/* Storage */}
          <StorageChart />
        </div>
      </section>
      <section>
        <TaskProgressChart />
      </section>
    </main>
  );
}
