import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import NoticesView from "./notices-view";

export default async function NoticesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <DashboardShell>Please sign in.</DashboardShell>;
  }

  const { data: notices, error } = await supabase
    .from("notices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notices:", error);
    return <div>Error loading notices.</div>;
  }

  // Wrap the entire client-side notices view cleanly inside the server dashboard shell
  return <NoticesView user={user} notices={notices || []} />;
}
