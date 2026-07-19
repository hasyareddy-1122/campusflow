"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutDashboard,
  CheckCircle,
  CalendarDays,
  BrainCircuit,
  ListTodo,
} from "lucide-react";

export function DashboardStats({
  tasksCount,
  eventsCount,
  attendancePercentage,
}: {
  tasksCount: number;
  eventsCount: number;
  attendancePercentage: number;
}) {
  const stats = [
    { title: "Pending Tasks", value: tasksCount || 0, icon: ListTodo },
    { title: "Upcoming Events", value: eventsCount || 0, icon: CalendarDays },
    {
      title: "Attendance",
      value: `${attendancePercentage.toFixed(1)}%`,
      icon: CheckCircle,
    },
    { title: "AI Insights", value: "Active", icon: BrainCircuit },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}>
          <Card className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
