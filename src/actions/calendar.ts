"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCalendarEvent(userId: string, data: { title: string; startTime: Date; endTime: Date }) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('calendar_events').insert({ ...data, userId });
  if (error) throw error;
  revalidatePath("/calendar");
}

export async function deleteCalendarEvent(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('calendar_events').delete().eq('id', id);
  if (error) throw error;
  revalidatePath("/calendar");
}
