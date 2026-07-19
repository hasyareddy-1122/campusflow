"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logMutation } from "@/lib/debug";

/**
 * Creates a new job application. 
 * Automatically resolves the company name into a standard placement_companies reference.
 */
export async function createPlacementApplication(prevState: any, formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be signed in to perform this action." };

    const companyName = (formData.get("company_name") as string)?.trim();
    const role = (formData.get("role") as string)?.trim() || "Software Engineer";
    const status = (formData.get("status") as string) || "APPLIED";
    const applied_date = formData.get("applied_date") as string;
    const salary = (formData.get("salary") as string)?.trim();
    const notes = (formData.get("notes") as string)?.trim();

    if (!companyName) {
      return { error: "Company name is required." };
    }

    // Resolve or insert placement company reference
    let companyId: any = null;
    const { data: existingCompany } = await supabase
      .from("placement_companies")
      .select("id")
      .eq("name", companyName)
      .maybeSingle();

    if (existingCompany) {
      companyId = existingCompany.id;
    } else {
      const { data: newCompany, error: insertCompanyErr } = await supabase
        .from("placement_companies")
        .insert({ name: companyName })
        .select()
        .single();

      if (insertCompanyErr) throw insertCompanyErr;
      companyId = newCompany.id;
    }

    const payload = {
      user_id: user.id,
      company_id: companyId,
      role,
      status,
      applied_date: applied_date ? new Date(applied_date).toISOString() : new Date().toISOString(),
      salary: salary || null,
      notes: notes || null
    };

    const { data, error } = await supabase
      .from("placement_applications")
      .insert([payload])
      .select();

    await logMutation("placement_applications", payload, data, error);
    if (error) throw error;

    revalidatePath("/placements");
    return { success: true };
  } catch (err: any) {
    console.error("Error creating placement app:", err.message);
    return { error: err.message || "Failed to create application." };
  }
}

/**
 * Updates an existing placement application record.
 */
export async function updatePlacementApplication(
  id: string, 
  updates: {
    company_name?: string;
    role: string;
    status: string;
    applied_date: string;
    salary: string;
    notes: string;
  }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    let companyId: any = undefined;

    if (updates.company_name) {
      const trimmedCompany = updates.company_name.trim();
      const { data: company } = await supabase
        .from("placement_companies")
        .select("id")
        .eq("name", trimmedCompany)
        .maybeSingle();

      if (company) {
        companyId = company.id;
      } else {
        const { data: newComp, error: compErr } = await supabase
          .from("placement_companies")
          .insert({ name: trimmedCompany })
          .select()
          .single();
        if (compErr) throw compErr;
        companyId = newComp.id;
      }
    }

    const payload: any = {
      role: updates.role,
      status: updates.status,
      applied_date: new Date(updates.applied_date).toISOString(),
      salary: updates.salary || null,
      notes: updates.notes || null
    };

    if (companyId) {
      payload.company_id = companyId;
    }

    const { data, error } = await supabase
      .from("placement_applications")
      .update(payload)
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    await logMutation("placement_applications", { id, ...updates }, data, error);
    if (error) throw error;

    revalidatePath("/placements");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating application:", err);
    return { error: err.message || "Failed to update record." };
  }
}

/**
 * Deletes a placement application.
 */
export async function deletePlacementApplication(id: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("placement_applications")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    await logMutation("placement_applications", { id }, data, error);
    if (error) throw error;

    revalidatePath("/placements");
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting application:", err);
    return { error: err.message || "Failed to remove record." };
  }
}