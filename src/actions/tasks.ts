"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TaskSchema = z.object({
  title: z.string().min(1),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export async function createTask(userId: string, data: z.infer<typeof TaskSchema>) {
  const supabase = await createSupabaseServerClient();
  const validated = TaskSchema.parse(data);
  const { error } = await supabase.from('tasks').insert({ ...validated, userId });
  if (error) throw error;
  revalidatePath("/tasks");
}

export async function updateTask(id: string, data: Partial<z.infer<typeof TaskSchema>>) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('tasks').update(data).eq('id', id);
  if (error) throw error;
  revalidatePath("/tasks");
}

export async function deleteTask(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
  revalidatePath("/tasks");
}
