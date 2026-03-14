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
import {
  dashboardMetrics,
  recentActivity,
  tasks,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Advisor dashboard"
        title="Good morning, Neha"
        description="Start with the accounts that need a touchpoint, the tasks that affect client confidence, and the portfolios drifting away from model intent."
        badge="Live workspace"
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <MetricCard
          title="Total AUM"
          value={dashboardMetrics.totalAum}
          change="+4.8% month over month"
          description="Across 20 managed portfolios"
          icon={IconWallet}
          currency
        />
        <MetricCard
          title="Active clients"
          value={dashboardMetrics.activeClients}
          change="+2 new relationships"
          description="Households with an open mandate"
          icon={IconTrendingUp}
        />
        <MetricCard
          title="Upcoming tasks"
          value={dashboardMetrics.upcomingTasks}
          change="6 due in 48 hours"
          description="Prep, follow-up, and compliance actions"
          icon={IconChecklist}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Portfolio performance</CardTitle>
            <CardDescription>
              Rolling firm-level market value trend across the current reporting
              quarter.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <PortfolioPerformanceChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Recent client activity</CardTitle>
            <CardDescription>
              Relationship events from the last operating cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            {recentActivity.map((activity) => (
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
            ))}
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
        <CardContent className="pt-5">
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
              {tasks.slice(0, 6).map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.clientName}</TableCell>
                  <TableCell>
                    <Badge variant={task.priority === "High" ? "default" : "secondary"}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{formatDateTime(task.dueAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
