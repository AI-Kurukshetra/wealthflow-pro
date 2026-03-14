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
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import {
  clients,
  documents,
  goals,
  transactions,
} from "@/lib/mock-data";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = clients.find((entry) => entry.id === id);

  if (!client) {
    notFound();
  }

  const clientGoals = goals.filter((goal) => goal.clientId === client.id);
  const clientDocuments = documents.filter(
    (document) => document.clientName === client.name
  );
  const clientTransactions = transactions
    .filter((transaction) => transaction.clientName === client.name)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Client 360"
        title={client.name}
        description={`${client.segment} household in ${client.city} with ${client.riskProfile?.toLowerCase()} suitability profile and an upcoming review already queued.`}
        badge={client.status}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Relationship value</CardDescription>
            <CardTitle>{formatCurrency(client.aum)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Next review</CardDescription>
            <CardTitle>{formatDateTime(client.nextReviewAt)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Risk profile</CardDescription>
            <CardTitle>{client.riskProfile}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-4">
          <Card>
            <CardHeader className="border-b border-border/60">
              <CardTitle>Recent transactions</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.tradeDate)}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.security}</TableCell>
                      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="goals" className="pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {clientGoals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <CardDescription>{goal.name}</CardDescription>
                  <CardTitle>{formatCurrency(goal.targetAmount)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${goal.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>{goal.progressPercent}% funded</span>
                    <Badge variant="outline">{formatDate(goal.targetDate)}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="documents" className="pt-4">
          <Card>
            <CardHeader className="border-b border-border/60">
              <CardTitle>Document vault</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {clientDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/20 p-3"
                >
                  <div>
                    <p className="font-medium">{document.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded {formatDate(document.uploadedAt)}
                    </p>
                  </div>
                  <Badge variant="secondary">{document.category}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
