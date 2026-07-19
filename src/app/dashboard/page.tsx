import { DashboardStats } from "./dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDynamicInsights } from "@/actions/insights";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch stats and insights in parallel
  const [stats, insights] = await Promise.all([
    Promise.all([
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id || ""),
      supabase
        .from("calendar_events")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id || ""),
      supabase
        .from("attendance")
        .select("conducted_classes, attended_classes")
        .eq("user_id", user?.id || ""),
    ]),
    getDynamicInsights(),
  ]);

  // Destructure the stats array correctly
  const [tasksResult, eventsResult, attendanceResult] = stats;

  const tasksCount = tasksResult.count ?? 0;
  const eventsCount = eventsResult.count ?? 0;
  const attendance = attendanceResult.data || [];

  const totalConducted = attendance.reduce(
    (sum, sub) => sum + (sub.conducted_classes || 0),
    0,
  );
  const totalAttended = attendance.reduce(
    (sum, sub) => sum + (sub.attended_classes || 0),
    0,
  );

  const attendancePercentage =
    totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 100) : 0;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tighter">
          Welcome back, {user?.user_metadata?.name || "Student"}
        </h2>
        <p className="text-muted-foreground">
          Here&apos;s your daily academic overview.
        </p>
      </header>

      <DashboardStats
        tasksCount={tasksCount}
        eventsCount={eventsCount}
        attendancePercentage={attendancePercentage}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl shadow-sm">
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-300 italic text-sm">{insights}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
