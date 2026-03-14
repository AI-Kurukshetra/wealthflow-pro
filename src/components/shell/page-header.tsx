import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  badge?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 border-b border-border/70 pb-6 md:flex-row md:items-end md:justify-between md:pb-7",
        className
      )}
    >
      <div className="max-w-3xl space-y-2.5">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {title}
          </h1>
          {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        </div>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">
          {description}
        </p>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
