import type { ReactNode } from "react";

import { AppHeader } from "@/components/shell/app-header";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="min-h-screen bg-background/80">
        <AppHeader />
        <main className="flex flex-1 flex-col px-4 py-6 md:px-6 md:py-7">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
