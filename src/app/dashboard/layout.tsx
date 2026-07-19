// src/app/dashboard/layout.tsx
// This layout wraps everything inside /dashboard with the shell.
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
