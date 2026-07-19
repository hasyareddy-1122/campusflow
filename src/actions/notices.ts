"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

// AI Summarization Logic
export async function summarizeNotice(content: string) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "Summarize this notice in 3-5 bullet points, focusing on deadlines, required actions, and important dates." 
        },
        { role: "user", content: content },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return completion.choices[0]?.message?.content || "Could not generate summary.";
  } catch (error) {
    console.error("AI Summarization Error:", error);
    return "Failed to connect to AI service.";
  }
}

// Add Notice
export async function addNotice(prevState: any, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const title = formData.get("title") as string;
  const text = formData.get("text") as string;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("notices").insert({
    user_id: user.id,
    title,
    original_text: text,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/notices");
  return { success: true };
}

// Update Notice (Handles AI summary updates and manual edits)
export async function updateNotice(id: string, data: { title: string; original_text: string; ai_summary: string }) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from("notices")
    .update({
      title: data.title,
      original_text: data.original_text,
      ai_summary: data.ai_summary,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/notices");
  return { success: true };
}

// Delete Notice
export async function deleteNotice(id: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("notices").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/notices");
  return { success: true };
}