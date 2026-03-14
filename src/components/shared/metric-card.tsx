import type { Icon } from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCompactCurrency } from "@/lib/format";

export function MetricCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  currency = false,
}: {
  title: string;
  value: number;
  change: string;
  description: string;
  icon: Icon;
  currency?: boolean;
}) {
  return (
    <Card className="border-border/80 bg-card/95">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardDescription className="flex items-center justify-between text-xs uppercase tracking-[0.18em]">
          <span>{title}</span>
          <Icon className="size-4 text-primary" />
        </CardDescription>
        <CardTitle className="text-3xl font-semibold tracking-tight">
          {currency ? formatCompactCurrency(value) : value.toLocaleString("en-IN")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between pt-4">
        <span className="text-sm text-muted-foreground">{description}</span>
        <span className="text-sm font-medium text-primary">{change}</span>
      </CardContent>
    </Card>
  );
}
