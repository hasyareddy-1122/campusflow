import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TasksPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
        <DashboardShell>
            <PageContainer>
                <SectionHeader title="Tasks" />
                <p>Please sign in to view your tasks.</p>
            </PageContainer>
        </DashboardShell>
    );
  }

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('userId', user.id)
    .order('createdAt', { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return <div>Error loading tasks.</div>;
  }

  return (
    <DashboardShell>
      <PageContainer>
        <SectionHeader title="Tasks" description="Manage your assignments." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["TODO", "IN_PROGRESS", "COMPLETED"].map((status) => (
                <Card key={status}>
                    <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold">{status}</h3>
                        {tasks.filter(t => t.status === status).map(task => (
                            <div key={task.id} className="p-2 border rounded">{task.title}</div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
