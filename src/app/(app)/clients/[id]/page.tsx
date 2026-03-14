import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getClientDetailData } from "@/lib/wealthflow/server";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getClientDetailData(id);

  if (!detail) {
    notFound();
  }

  const totalAum = detail.portfolios.reduce(
    (sum, portfolio) => sum + Number(portfolio.market_value),
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Client 360"
        title={detail.client.household_name}
        description={`${detail.client.city ?? "Client city unavailable"} household with ${
          detail.client.risk_profile?.toLowerCase() ?? "unassigned"
        } suitability and live portfolios, tasks, documents, and meetings from Supabase.`}
        badge={detail.client.client_status}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Relationship value</CardDescription>
            <CardTitle>{formatCurrency(totalAum)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Client since</CardDescription>
            <CardTitle>{formatDateTime(detail.client.created_at)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Risk profile</CardDescription>
            <CardTitle>{detail.client.risk_profile ?? "Unassigned"}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Tabs defaultValue="portfolios">
        <TabsList>
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
        </TabsList>
        <TabsContent value="portfolios" className="pt-4">
          <Card>
            <CardHeader className="border-b border-border/60">
              <CardTitle>Related portfolios</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Portfolio</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Custodian</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.portfolios.map((portfolio) => (
                    <TableRow key={portfolio.id}>
                      <TableCell>{portfolio.name}</TableCell>
                      <TableCell>{portfolio.account_type}</TableCell>
                      <TableCell>{portfolio.custodian ?? "Unknown"}</TableCell>
                      <TableCell>{portfolio.portfolio_status}</TableCell>
                      <TableCell>{formatCurrency(Number(portfolio.market_value))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks" className="pt-4">
          <Card>
            <CardHeader className="border-b border-border/60">
              <CardTitle>Client tasks</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.task_type}</TableCell>
                      <TableCell>{task.priority}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>
                        {task.due_at ? formatDateTime(task.due_at) : "No due date"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents" className="pt-4">
          <Card>
            <CardHeader className="border-b border-border/60">
              <CardTitle>Document vault</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {detail.documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/20 p-3"
                >
                  <div>
                    <p className="font-medium">{document.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded {formatDateTime(document.uploaded_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{document.document_category}</Badge>
                    <a
                      className="text-sm font-medium text-primary hover:underline"
                      href={`/api/documents/${document.id}/download`}
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="meetings" className="pt-4">
          <Card>
            <CardHeader className="border-b border-border/60">
              <CardTitle>Client meetings</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meeting</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Starts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.meetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>{meeting.title}</TableCell>
                      <TableCell>{meeting.meeting_type}</TableCell>
                      <TableCell>{meeting.channel}</TableCell>
                      <TableCell>{meeting.status}</TableCell>
                      <TableCell>{formatDateTime(meeting.starts_at)}</TableCell>
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
