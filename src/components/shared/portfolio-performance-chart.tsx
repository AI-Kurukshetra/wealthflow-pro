import { monthlyPerformance } from "@/lib/mock-data";

const maxValue = Math.max(...monthlyPerformance.map((entry) => entry.value));

export function PortfolioPerformanceChart() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-3">
        {monthlyPerformance.map((entry) => (
          <div key={entry.label} className="space-y-2">
            <div className="flex h-44 items-end rounded-2xl bg-muted/60 p-2">
              <div
                className="w-full rounded-xl bg-gradient-to-t from-primary via-chart-2 to-chart-1 transition-all"
                style={{
                  height: `${Math.max((entry.value / maxValue) * 100, 18)}%`,
                }}
              />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-xs font-medium text-foreground">{entry.label}</p>
              <p className="text-xs text-muted-foreground">
                {(entry.value / 10_000_000).toFixed(1)} Cr
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Simulated aggregate market value trend based on the WealthFlow advisor
        dashboard blueprint.
      </p>
    </div>
  );
}
