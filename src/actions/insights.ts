"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import Groq from "groq-sdk";


export async function getDynamicInsights() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "Please sign in to see insights.";
  const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });
  
  // 1. Fetch data from your modules
  const [tasks, attendance] = await Promise.all([
    supabase.from("tasks").select("*").eq("user_id", user?.id),
    supabase.from("attendance").select("*").eq("user_id", user?.id),
  ]);

  // 2. Build a context prompt
  const context = `User tasks: ${JSON.stringify(tasks.data)}. Attendance: ${JSON.stringify(attendance.data)}.`;

  // 3. Ask AI for a personalized insight
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful academic assistant. Analyze the user's data and provide one short, actionable, and encouraging insight in one sentence." },
      { role: "user", content: context },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return completion.choices[0]?.message?.content;
}