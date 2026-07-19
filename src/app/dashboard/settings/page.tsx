import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <PageContainer>
        <SectionHeader title="Settings" />
        <p>Please sign in to view settings.</p>
      </PageContainer>
    );
  }

  // Fetch or create settings
  let { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!settings) {
    const { data: newSettings } = await supabase
      .from("settings")
      .insert({ user_id: user.id })
      .select()
      .single();
    settings = newSettings;
  }

  return (
    <PageContainer>
      <SectionHeader title="Settings" description="Manage your preferences." />

      <div className="grid gap-6">
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>Theme: {settings?.theme || "light"}</CardContent>
        </Card>
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            WhatsApp: {settings?.whatsapp_enabled ? "On" : "Off"}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
