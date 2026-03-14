import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/shell/app-sidebar";
import { renderWithAppProviders, screen } from "@/test/test-utils";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockedUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const viewer = {
  name: "Vineeth Motati",
  email: "vineeth.motati@wealthflow.in",
  title: "Senior Wealth Advisor",
  initials: "VM",
  organizationName: "WealthFlow Advisory",
  organizationLocation: "India • Asia/Kolkata",
};

describe("AppSidebar", () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue("/clients/client-001");
  });

  it("renders the primary navigation links", () => {
    renderWithAppProviders(<AppSidebar viewer={viewer} />, { withSidebarProvider: true });

    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByRole("link", { name: "Clients" })).toHaveAttribute(
      "href",
      "/clients"
    );
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/settings"
    );
  });

  it("keeps the clients entry active for nested client profile routes", () => {
    renderWithAppProviders(<AppSidebar viewer={viewer} />, { withSidebarProvider: true });

    const clientsLink = screen.getByRole("link", { name: "Clients" });

    expect(clientsLink.closest('[data-active="true"]')).toBeInTheDocument();
  });
});
