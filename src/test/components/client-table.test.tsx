import userEvent from "@testing-library/user-event";

import ClientsPage from "@/app/(app)/clients/page";
import { renderWithAppProviders, screen } from "@/test/test-utils";

describe("ClientsPage", () => {
  it("renders the seeded client roster table", () => {
    renderWithAppProviders(<ClientsPage />);

    expect(
      screen.getByRole("heading", { name: "Client relationships" })
    ).toBeInTheDocument();
    expect(screen.getByText("Household roster")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Aarav & Meera Shah/i })).toHaveAttribute(
      "href",
      "/clients/client-001"
    );
    expect(screen.getByText("20 seeded clients")).toBeInTheDocument();
  });

  it("opens the new client intake dialog on user interaction", async () => {
    const user = userEvent.setup();

    renderWithAppProviders(<ClientsPage />);

    await user.click(screen.getByRole("button", { name: "New client" }));

    expect(
      await screen.findByRole("heading", { name: "New client intake" })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Household or client name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Primary email")).toBeInTheDocument();
  });
});
