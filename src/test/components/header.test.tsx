import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";

import { AppHeader } from "@/components/shell/app-header";
import { renderWithAppProviders, screen, within } from "@/test/test-utils";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockedUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("AppHeader", () => {
  it("derives the client profile label from nested client routes", () => {
    mockedUsePathname.mockReturnValue("/clients/client-001");

    renderWithAppProviders(<AppHeader />, { withSidebarProvider: true });

    expect(screen.getByText("Client profile")).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", {
        name: "Search households, tasks, or documents",
      })
    ).toBeInTheDocument();
  });

  it("opens the theme menu when the user interacts with the toggle", async () => {
    mockedUsePathname.mockReturnValue("/dashboard");
    const user = userEvent.setup();

    renderWithAppProviders(<AppHeader />, { withSidebarProvider: true });

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));

    const menu = await screen.findByRole("menu");
    expect(within(menu).getByText("Appearance")).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: "Dark" })).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: "System" })).toBeInTheDocument();
  });
});
