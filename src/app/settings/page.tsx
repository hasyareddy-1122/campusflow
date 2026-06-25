import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
        <DashboardShell>
            <PageContainer>
                <SectionHeader title="Settings" />
                <p>Please sign in to view settings.</p>
            </PageContainer>
        </DashboardShell>
    );
  }

  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("userId", user.id)
    .single();

  return (
    <DashboardShell>
      <PageContainer>
        <SectionHeader title="Settings" />
        
        <div className="grid gap-6">
            <Card>
                <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
                <CardContent>Theme: {settings?.theme}</CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
                <CardContent>WhatsApp: {settings?.whatsappEnabled ? "On" : "Off"}</CardContent>
            </Card>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
