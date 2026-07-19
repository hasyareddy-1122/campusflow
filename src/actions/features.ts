"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logMutation } from "@/lib/debug";

export async function createStudySession(prevState: any, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const payload = {
      user_id: user.id,
      duration: parseInt(formData.get("duration") as string)
  };

  const { data, error } = await supabase.from('study_sessions').insert(payload).select();
  await logMutation("study_sessions", payload, data, error);
  if (error) return { error: error.message };
  revalidatePath("/study-buddy");
  return { success: true };
}

export async function deleteStudySession(id: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('study_sessions').delete().eq('id', id).select();
    await logMutation("study_sessions", { id }, data, error);
    if (error) throw error;
    revalidatePath("/study-buddy");
}

export async function createPlacementApplication(prevState: any, formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const payload = {
        user_id: user.id,
        company_id: formData.get("company_id")
    };

    const { data, error } = await supabase.from('placement_applications').insert(payload).select();
    await logMutation("placement_applications", payload, data, error);
    if (error) return { error: error.message };
    revalidatePath("/placement");
    return { success: true };
}

export async function deletePlacementApplication(id: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('placement_applications').delete().eq('id', id).select();
    await logMutation("placement_applications", { id }, data, error);
    if (error) throw error;
    revalidatePath("/placement");
}
