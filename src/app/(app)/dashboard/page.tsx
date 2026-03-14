import {
  IconChecklist,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";

import { PageHeader } from "@/components/shell/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { PortfolioPerformanceChart } from "@/components/shared/portfolio-performance-chart";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import { getDashboardData } from "@/lib/wealthflow/server";

export default async function DashboardPage() {
  const { activities, chart, metrics, tasks, workspace } = await getDashboardData();
  const firstName = workspace.profile?.full_name?.split(" ")[0] ?? "Advisor";

  return (
    <div className="space-y-5 xl:space-y-6">
      <PageHeader
        eyebrow="Advisor dashboard"
        title={`Good morning, ${firstName}`}
        description="Start with the accounts that need a touchpoint, the tasks that affect client confidence, and the portfolios drifting away from model intent."
        badge="Live workspace"
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          title="Total AUM"
          value={Number(metrics?.total_aum ?? 0)}
          change={`${Number(metrics?.upcoming_meetings ?? 0)} meetings scheduled`}
          description="Across active advisory portfolios"
          icon={IconWallet}
          currency
        />
        <MetricCard
          title="Active clients"
          value={Number(metrics?.active_clients ?? 0)}
          change={`${Number(metrics?.total_clients ?? 0)} total households`}
          description="Households with an active mandate"
          icon={IconTrendingUp}
        />
        <MetricCard
          title="Upcoming tasks"
          value={Number(metrics?.open_tasks ?? 0)}
          change={`${tasks.length} next tasks on deck`}
          description="Prep, follow-up, and compliance actions"
          icon={IconChecklist}
        />
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(20rem,0.95fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/60">
            <CardTitle>Portfolio performance</CardTitle>
            <CardDescription>
              Rolling firm-level market value trend across the seeded snapshot history.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <PortfolioPerformanceChart points={chart} />
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/60">
            <CardTitle>Recent client activity</CardTitle>
            <CardDescription>
              Relationship events from the last operating cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 pt-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/20 p-3"
                >
                  <Avatar className="size-10">
                    <AvatarFallback>
                      {activity.clientName
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.clientName}</p>
                    <p className="text-sm text-muted-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(activity.occurredAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/80 bg-muted/15 p-6 text-sm text-muted-foreground">
                No client activity has landed yet. Fresh updates will appear here as
                advisors log notes, reviews, and follow-ups.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Upcoming tasks</CardTitle>
          <CardDescription>
            The next commitments that shape service quality and compliance.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.clientName}</TableCell>
                    <TableCell>
                      <Badge variant={task.priority === "high" ? "default" : "secondary"}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>
                      {task.dueAt ? formatDateTime(task.dueAt) : "No due date"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="py-8 text-center text-sm text-muted-foreground"
                    colSpan={5}
                  >
                    No upcoming tasks are queued. New work will surface here as
                    reminders, prep, and follow-ups are scheduled.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
