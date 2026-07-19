"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logMutation } from "@/lib/debug";

// Validate inputs matching standard Supabase columns
const TaskSchema = z.object({
  title: z.string().min(1, "Task name is required"),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  description: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
});

export async function createTask(prevState: any, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const rawData = Object.fromEntries(formData.entries());
  const validated = TaskSchema.safeParse(rawData);
  if (!validated.success) {
    console.error("Validation failed:", validated.error.format());
    return { error: "Invalid data format" };
  }

  const { title, status, priority, description, deadline, phone } = validated.data;
  const formattedDeadline = deadline && deadline.trim() !== "" ? new Date(deadline).toISOString() : null;

  // Clean, standardized insert payload
  const dbPayload = {
    title,
    status,
    priority,
    description: description || null,
    deadline: formattedDeadline,
    phone: phone || null,
    user_id: user.id
  };

  const { data, error } = await supabase.from('tasks').insert(dbPayload).select();
  await logMutation("tasks", dbPayload, data, error);
  
  if (error) {
    console.error("Supabase Database Save Error:", error.message);
    return { error: `Database Error: ${error.message}` };
  }

  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  if (n8nWebhookUrl) {
    try {
      await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: user.email ? user.email.split("@")[0] : "Student",
          phone: phone || "",
          subject: description || "General",
          deadline: formattedDeadline || new Date().toISOString(),
          taskTitle: title,
          priority,
          status
        }),
      });
    } catch (webhookErr) {
      console.error("Failed to trigger n8n endpoint payload:", webhookErr);
    }
  }
  
  revalidatePath("/tasks");
  return { success: true };
}

export async function updateTask(id: string, data: Partial<z.infer<typeof TaskSchema>>) {
  const supabase = await createSupabaseServerClient();
  const { phone, ...dbUpdates } = data;
  
  const updatePayload: any = { ...dbUpdates };
  if (phone !== undefined) updatePayload.phone = phone;

  const { data: updatedData, error } = await supabase
    .from('tasks')
    .update(updatePayload)
    .eq('id', id)
    .select();
    
  await logMutation("tasks", updatePayload, updatedData, error);
  if (error) throw error;
  revalidatePath("/tasks");
}

export async function deleteTask(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('tasks').delete().eq('id', id).select();
  await logMutation("tasks", { id }, data, error);
  if (error) throw error;
  revalidatePath("/tasks");
}