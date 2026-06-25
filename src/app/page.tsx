import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { MOCK_STATS, MOCK_SCHEDULE, MOCK_DEADLINES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_STATS.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader><CardTitle>Today's Schedule</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {MOCK_SCHEDULE.map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm text-muted-foreground">{item.time} • {item.room}</p>
                  </div>
                  <Badge variant={item.status === "Ongoing" ? "default" : "secondary"}>{item.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader><CardTitle>Upcoming Deadlines</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {MOCK_DEADLINES.map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{item.subject} - {item.assignment}</p>
                    <p className="text-sm text-muted-foreground">Due: {item.due}</p>
                  </div>
                  <Badge variant={item.priority === "High" ? "destructive" : "outline"}>{item.priority}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground md:col-span-1">
            <CardHeader><CardTitle>AI Tip of the Day</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-4">"Try the Pomodoro technique for focused 25-minute study sessions to improve retention."</p>
              <Button variant="secondary" size="sm">Generate New Tip</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
