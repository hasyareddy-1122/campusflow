"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const regNumber = formData.get("regNumber") as string;
  const department = formData.get("department") as string;

  await supabase.from("student_profiles").insert({
    userId: user.id,
    name,
    regNumber,
    department,
    branch: "CSE",
    semester: "SEM1"
  });

  await supabase.from("settings").insert({
    userId: user.id
  });

  redirect("/dashboard");
}
