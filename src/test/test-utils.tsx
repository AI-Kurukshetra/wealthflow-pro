import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";

type AppRenderOptions = RenderOptions & {
  withSidebarProvider?: boolean;
};

function AppProviders({
  children,
  withSidebarProvider = false,
}: {
  children: ReactNode;
  withSidebarProvider?: boolean;
}) {
  const content = withSidebarProvider ? (
    <SidebarProvider defaultOpen>{children}</SidebarProvider>
  ) : (
    children
  );

  return (
    <ThemeProvider>
      <TooltipProvider>{content}</TooltipProvider>
    </ThemeProvider>
  );
}

export function renderWithAppProviders(
  ui: ReactElement,
  { withSidebarProvider = false, ...options }: AppRenderOptions = {}
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AppProviders withSidebarProvider={withSidebarProvider}>
        {children}
      </AppProviders>
    ),
    ...options,
  });
}

export * from "@testing-library/react";
