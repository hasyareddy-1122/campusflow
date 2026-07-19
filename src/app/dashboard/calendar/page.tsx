import { createSupabaseServerClient } from "@/lib/supabase/server";
import CalendarView from "./calendar-view";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function CalendarPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <DashboardShell>Please sign in.</DashboardShell>;

  const { data: events, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', user.id)
    .order('start_time', { ascending: true });

  if (error) {
    console.error("Error fetching calendar events:", error);
    return <div>Error loading calendar events.</div>;
  }

  return <CalendarView user={user} events={events || []} />;
}
