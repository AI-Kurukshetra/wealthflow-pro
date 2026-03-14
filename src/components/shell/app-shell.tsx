import type { ReactNode } from "react";

import { AppHeader } from "@/components/shell/app-header";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="min-h-svh bg-background/80 md:h-svh md:overflow-hidden">
        <div className="flex min-h-svh flex-1 flex-col md:h-svh">
          <AppHeader />
          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5 md:px-6 md:py-6">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
