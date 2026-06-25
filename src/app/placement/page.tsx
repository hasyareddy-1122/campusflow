"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table } from "@/components/shared/table";
import { MOCK_COMPANIES } from "@/lib/mock-placement";

export default function PlacementPage() {
  const headers = ["Company", "Role", "Package", "Status", "Date"];
  const data = MOCK_COMPANIES.map(c => [c.company, c.role, c.package, c.status, c.date]);

  return (
    <DashboardShell>
      <PageContainer>
        <SectionHeader title="Placement Tracker" />
        
        <Card>
            <CardHeader><CardTitle>Applied Companies</CardTitle></CardHeader>
            <CardContent><Table headers={headers} data={data} /></CardContent>
        </Card>
      </PageContainer>
    </DashboardShell>
  );
}
