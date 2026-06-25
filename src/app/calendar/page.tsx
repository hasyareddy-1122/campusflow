import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CalendarPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
        <DashboardShell>
            <PageContainer>
                <SectionHeader title="Calendar" />
                <p>Please sign in to view your calendar.</p>
            </PageContainer>
        </DashboardShell>
    );
  }

  const { data: events, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('userId', user.id)
    .order('startTime', { ascending: true });

  if (error) {
    console.error("Error fetching calendar events:", error);
    return <div>Error loading calendar events.</div>;
  }

  return (
    <DashboardShell>
      <PageContainer>
        <SectionHeader 
          title="Calendar" 
          action={<Button>Add Event</Button>}
        />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-xl border bg-card p-4">
             {/* Simple list view for now as full calendar needs external lib */}
             {events.map(event => <div key={event.id} className="p-2 border-b">{event.title}</div>)}
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
