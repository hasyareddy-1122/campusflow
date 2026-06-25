import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";

export default function AttendancePage() {
  return (
    <DashboardShell>
      <PageContainer>
        <SectionHeader title="Attendance" description="Track your class attendance." />
        <div className="text-muted-foreground">Attendance content placeholder.</div>
      </PageContainer>
    </DashboardShell>
  );
}
