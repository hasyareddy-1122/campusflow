"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Handles student registration using unified server client.
 */
export async function signup(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const department = formData.get("department") as string;
  const branch = formData.get("branch") as string;
  const reg_number = formData.get("reg_number") as string;
  const semester = formData.get("semester") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createSupabaseServerClient();
  console.log("SIGNUP STARTING FOR:", email);

  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "http://localhost:3000/auth/callback",
      data: {
        name,
        phone,
        department,
        branch,
        reg_number,
        semester,
      },
    },
  });

  if (authError) {
    console.error("AUTH SIGNUP ERROR:", authError);
    return { error: authError.message };
  }

  console.log("SIGNUP SUCCESSFUL. Profile automatically handled by SQL Trigger.");
  redirect("/login");
}

/**
 * Handles student login using unified server client.
 */
export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createSupabaseServerClient();
  console.log("LOGIN ATTEMPT FOR:", email);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("AUTH LOGIN ERROR:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  redirect("/dashboard");
}

/**
 * Handles student logout.
 */
export async function logout() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("AUTH LOGOUT ERROR:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  redirect("/dashboard");
}