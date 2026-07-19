import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import PlacementsView from "./placements-view";

export default async function PlacementPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <PageContainer>
        <SectionHeader title="Placement Tracker" />
        <p className="text-neutral-400 py-6 text-sm">
          Please sign in to view your application tracks.
        </p>
      </PageContainer>
    );
  }

  // Fetch applications with joined company details
  const { data: applications, error: appError } = await supabase
    .from("placement_applications")
    .select(
      `
      *,
      company:placement_companies(name)
    `,
    )
    .eq("user_id", user.id)
    .order("applied_date", { ascending: false });

  // Fetch registered companies list for potential autocomplete select reference
  const { data: companies } = await supabase
    .from("placement_companies")
    .select("id, name")
    .order("name", { ascending: true });

  if (appError) {
    console.error("Error fetching applications:", appError);
    return (
      <PageContainer>
        <SectionHeader title="Placement Tracker" />
        <div className="text-rose-400 border border-rose-950 bg-rose-950/20 rounded-xl p-4 text-xs mt-4">
          Error loading job placement applications: {appError.message}
        </div>
      </PageContainer>
    );
  }

  // Inject user, application data lists and companies references to client View Wrapper
  return (
    <PlacementsView
      user={user}
      applications={applications || []}
      companies={companies || []}
    />
  );
}
