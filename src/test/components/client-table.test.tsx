import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import ClientsPage from "@/app/(app)/clients/page";
import { renderWithAppProviders, screen } from "@/test/test-utils";

jest.mock("@/lib/wealthflow/server", () => ({
  getClientsPageData: jest.fn(async () => ({
    workspace: {
      user: {
        id: "viewer-1",
      },
      organization: {
        id: "organization-1",
      },
    },
    clients: [
      {
        id: "client-1",
        household_name: "Aarav & Meera Shah",
        email: "aarav.shah@example.com",
        phone: "+91 9812345678",
        city: "Mumbai",
        client_status: "active",
        risk_profile: "Balanced",
        totalAum: 9500000,
        nextMeetingAt: "2026-03-15T10:30:00.000Z",
      },
    ],
  })),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("ClientsPage", () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue({
      refresh: jest.fn(),
    } as ReturnType<typeof useRouter>);
  });

  it("renders the live client roster table", async () => {
    renderWithAppProviders(await ClientsPage());

    expect(
      screen.getByRole("heading", { name: "Client relationships" })
    ).toBeInTheDocument();
    expect(screen.getByText("Household roster")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Aarav & Meera Shah/i })).toHaveAttribute(
      "href",
      "/clients/client-1"
    );
    expect(screen.getByText("1 live clients")).toBeInTheDocument();
  });

  it("opens the new client intake dialog on user interaction", async () => {
    const user = userEvent.setup();

    renderWithAppProviders(await ClientsPage());

    await user.click(screen.getByRole("button", { name: "New client" }));

    expect(
      await screen.findByRole("heading", { name: "New client intake" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Household name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });
});
