import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
        <DashboardShell>
            <PageContainer>
                <SectionHeader title="Profile" />
                <p>Please sign in to view your profile.</p>
            </PageContainer>
        </DashboardShell>
    );
  }

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("userId", user.id)
    .single();

  return (
    <DashboardShell>
      <PageContainer>
        <SectionHeader title="Profile" action={<Button>Edit Profile</Button>} />
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1 p-6 text-center">
             <div className="h-24 w-24 rounded-full bg-primary/20 mx-auto mb-4" />
             <h2 className="text-xl font-bold">{profile?.name}</h2>
             <p className="text-muted-foreground">{profile?.regNumber}</p>
          </Card>

          <Card className="md:col-span-2 p-6">
            <h3 className="font-semibold mb-4">Academic Info</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <p>Dept: <span className="font-medium">{profile?.department}</span></p>
                <p>Branch: <span className="font-medium">{profile?.branch}</span></p>
                <p>Sem: <span className="font-medium">{profile?.semester}</span></p>
            </div>
          </Card>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
