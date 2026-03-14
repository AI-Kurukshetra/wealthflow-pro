import { PageHeader } from "@/components/shell/page-header";
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
import { formatCurrency, formatPercent } from "@/lib/format";
import { getPortfoliosPageData } from "@/lib/wealthflow/server";

export default async function PortfoliosPage() {
  const { chart, portfolios, transactions } = await getPortfoliosPageData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Portfolio tracking"
        title="Managed portfolios"
        description="A single operating view across account types, custodians, allocation profiles, and return posture."
      />
      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Performance chart</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <PortfolioPerformanceChart points={chart} />
        </CardContent>
      </Card>
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
                  <TableCell>{portfolio.account_type}</TableCell>
                  <TableCell>{portfolio.custodian ?? "Unknown"}</TableCell>
                  <TableCell>{formatCurrency(Number(portfolio.market_value))}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {portfolio.latestPerformance !== null
                        ? formatPercent(Number(portfolio.latestPerformance))
                        : "Pending"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Transaction history</CardTitle>
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
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.trade_date}</TableCell>
                  <TableCell>{transaction.transaction_type}</TableCell>
                  <TableCell>{transaction.security_symbol ?? "Cash movement"}</TableCell>
                  <TableCell>{formatCurrency(transaction.net_amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
