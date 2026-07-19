"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const ProfileSchema = z.object({
  name: z.string().min(2),
  reg_number: z.string().min(3),
  department: z.string().min(2),
  branch: z.enum(['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL']),
  semester: z.enum(['SEM1', 'SEM2', 'SEM3', 'SEM4', 'SEM5', 'SEM6', 'SEM7', 'SEM8']),
  phone_number: z.string().optional(),
});

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const result = ProfileSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) return { error: result.error.flatten().fieldErrors };

  const { error } = await supabase
    .from("student_profiles")
    .upsert({ ...result.data, user_id: user.id }, { onConflict: 'user_id' });

  if (error) {
      console.error("UPSERT Error:", error);
      return { error: error.message };
  }

  redirect("/dashboard");
}
