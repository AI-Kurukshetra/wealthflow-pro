import { PageHeader } from "@/components/shell/page-header";
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
import { formatCurrency, formatPercent } from "@/lib/format";
import { portfolios } from "@/lib/mock-data";

export default function PortfoliosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Portfolio tracking"
        title="Managed portfolios"
        description="A single operating view across account types, custodians, allocation profiles, and return posture."
      />
      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Portfolio ledger</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Portfolio</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Custodian</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>YTD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolios.map((portfolio) => (
                <TableRow key={portfolio.id}>
                  <TableCell className="font-medium">{portfolio.name}</TableCell>
                  <TableCell>{portfolio.clientName}</TableCell>
                  <TableCell>{portfolio.accountType}</TableCell>
                  <TableCell>{portfolio.custodian}</TableCell>
                  <TableCell>{formatCurrency(portfolio.value)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {formatPercent(portfolio.ytdPerformance)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
