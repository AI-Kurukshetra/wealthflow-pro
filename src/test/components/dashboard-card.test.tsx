import { IconWallet } from "@tabler/icons-react";

import { MetricCard } from "@/components/shared/metric-card";
import { formatCompactCurrency } from "@/lib/format";
import { renderWithAppProviders, screen } from "@/test/test-utils";

describe("MetricCard", () => {
  it("renders the metric content for currency values", () => {
    renderWithAppProviders(
      <MetricCard
        change="+4.8% month over month"
        currency
        description="Across 20 managed portfolios"
        icon={IconWallet}
        title="Total AUM"
        value={362_400_000}
      />
    );

    expect(screen.getByText("Total AUM")).toBeInTheDocument();
    expect(screen.getByText(formatCompactCurrency(362_400_000))).toBeInTheDocument();
    expect(screen.getByText("Across 20 managed portfolios")).toBeInTheDocument();
    expect(screen.getByText("+4.8% month over month")).toBeInTheDocument();
  });

  it("renders plain numeric values when currency formatting is disabled", () => {
    renderWithAppProviders(
      <MetricCard
        change="+2 new relationships"
        description="Households with an open mandate"
        icon={IconWallet}
        title="Active clients"
        value={20}
      />
    );

    expect(screen.getByText("20")).toBeInTheDocument();
  });
});
