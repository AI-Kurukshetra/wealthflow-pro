import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/shell/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { PortfolioPerformanceChart } from "@/components/shared/portfolio-performance-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  complianceRecords,
  dashboardMetrics,
  meetings,
} from "@/lib/mock-data";
import {
  IconBriefcase,
  IconShieldCheck,
  IconTargetArrow,
} from "@tabler/icons-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Business intelligence"
        title="Firm analytics"
        description="Commercial, service, and compliance views distilled into one advisor operations layer."
      />
      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="service">Service</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="space-y-4 pt-4">
          <div className="grid gap-4 xl:grid-cols-3">
            <MetricCard
              title="Tracked AUM"
              value={dashboardMetrics.totalAum}
              change="+7.4% vs prior quarter"
              description="Assets currently monitored"
              icon={IconBriefcase}
              currency
            />
            <MetricCard
              title="Portfolio reviews"
              value={meetings.length}
              change="10 upcoming meetings"
              description="Scheduled in the current operating cycle"
              icon={IconTargetArrow}
            />
            <MetricCard
              title="Compliance posture"
              value={complianceRecords.filter((record) => record.status === "Compliant").length}
              change="3 items need follow-up"
              description="Records marked compliant"
              icon={IconShieldCheck}
            />
          </div>
          <Card>
            <CardHeader className="border-b border-border/60">
              <CardTitle>AUM growth curve</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <PortfolioPerformanceChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="service" className="pt-4">
          <Card>
            <CardHeader className="border-b border-border/60">
              <CardTitle>Service readiness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {[
                ["Quarterly reviews completed", "82%"],
                ["Meeting prep packs delivered", "91%"],
                ["Follow-up notes logged within 24h", "88%"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/20 p-4"
                >
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-lg font-semibold">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="compliance" className="pt-4">
          <Card>
            <CardHeader className="border-b border-border/60">
              <CardTitle>Compliance register</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Record</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.clientName}</TableCell>
                      <TableCell>{record.recordType}</TableCell>
                      <TableCell>{record.dueAt.slice(0, 10)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "Compliant" ? "secondary" : "default"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
