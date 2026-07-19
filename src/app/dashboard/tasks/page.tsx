import React from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import TasksView from "./tasks-view";
import type { Task } from "./tasks-view";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialTasks: Task[] = [];

  if (user) {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, description, status, priority, deadline, phone")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      initialTasks = data.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description || null,
        status: (task.status as "TODO" | "IN_PROGRESS" | "COMPLETED") || "TODO",
        priority: (task.priority as "LOW" | "MEDIUM" | "HIGH") || "MEDIUM",
        deadline: task.deadline || null,
        phone: task.phone || null,
      }));
    }
  }

  return <TasksView initialTasks={initialTasks} />;
}
