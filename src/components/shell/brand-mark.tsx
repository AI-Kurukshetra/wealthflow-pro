import { IconSparkles } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
        <IconSparkles className="size-5" />
      </div>
      {!compact ? (
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold tracking-tight">
            WealthFlow
          </span>
          <span className="truncate text-xs text-muted-foreground">
            Advisor intelligence cockpit
          </span>
        </div>
      ) : null}
    </div>
  );
}
