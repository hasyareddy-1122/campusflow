"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCalendarEvent(prevState: any, formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "You must be logged in to perform this action." };
    }

    const title = formData.get("title") as string;
    const start_time = formData.get("start_time") as string;
    const end_time = formData.get("end_time") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string || "General";

    if (!title || !start_time || !end_time) {
      return { error: "Please fill in all required fields." };
    }

    const { error } = await supabase
      .from("calendar_events")
      .insert([
        {
          user_id: user.id,
          title,
          start_time,
          end_time,
          description,
          category,
        },
      ]);

    if (error) throw error;

    revalidatePath("/calendar");
    return { success: true };
  } catch (err: any) {
    console.error("Error creating event:", err.message);
    return { error: err.message || "Failed to create event." };
  }
}

export async function updateCalendarEvent(id: string, updates: {
  title: string;
  start_time: string;
  end_time: string;
  description: string;
  category: string;
}) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to update events.");
    }

    const { error } = await supabase
      .from("calendar_events")
      .update({
        title: updates.title,
        start_time: updates.start_time,
        end_time: updates.end_time,
        description: updates.description,
        category: updates.category,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/calendar");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating event:", err.message);
    return { error: err.message || "Failed to update event." };
  }
}

export async function deleteCalendarEvent(id: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to delete events.");
    }

    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/calendar");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting event:", err.message);
    return { error: err.message || "Failed to delete event." };
  }
}