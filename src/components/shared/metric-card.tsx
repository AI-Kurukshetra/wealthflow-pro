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
    <Card className="border-border/70 bg-card/95 shadow-sm shadow-black/5">
      <CardHeader className="gap-3 border-b border-border/60 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardDescription className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground/85">
              {title}
            </CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight md:text-[2rem]">
              {currency ? formatCompactCurrency(value) : value.toLocaleString("en-IN")}
            </CardTitle>
          </div>
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <Icon className="size-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4 pt-4">
        <span className="max-w-[18ch] text-sm leading-5 text-muted-foreground">
          {description}
        </span>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {change}
        </span>
      </CardContent>
    </Card>
  );
}
