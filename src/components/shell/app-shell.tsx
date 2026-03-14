import type { ReactNode } from "react";

import { AppHeader } from "@/components/shell/app-header";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getShellData } from "@/lib/wealthflow/server";

export async function AppShell({ children }: { children: ReactNode }) {
  const shellData = await getShellData();

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar viewer={shellData.viewer} />
      <SidebarInset className="h-svh overflow-hidden bg-background/80 md:h-[calc(100svh-1rem)]">
        <div className="flex h-full flex-1 flex-col overflow-hidden">
          <AppHeader notifications={shellData.notifications} viewer={shellData.viewer} />
          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5 md:px-6 md:py-6">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
