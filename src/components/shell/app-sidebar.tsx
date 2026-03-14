"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArrowUpRight, IconFolderCheck } from "@tabler/icons-react";

import { advisorProfile } from "@/lib/mock-data";
import { primaryNavigation } from "@/lib/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { BrandMark } from "@/components/shell/brand-mark";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="gap-4 border-b border-sidebar-border/70">
        <BrandMark />
        <div className="rounded-2xl border border-sidebar-border/80 bg-sidebar-primary/8 p-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-medium text-sidebar-foreground">
                {advisorProfile.firm}
              </p>
              <p className="text-xs text-sidebar-foreground/70">
                Mumbai, India
              </p>
            </div>
            <Badge variant="secondary">MVP</Badge>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNavigation.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href === "/clients" && pathname.startsWith("/clients/"));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3 px-2">
              <div className="rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/50 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-sidebar-foreground/60">
                  Compliance queue
                </p>
                <p className="mt-2 text-sm font-medium text-sidebar-foreground">
                  3 reviews require attention before month-end cut-off.
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-sidebar-border/70 p-3 text-sm text-sidebar-foreground/75">
                <div className="flex items-center gap-2">
                  <IconFolderCheck className="size-4" />
                  SEBI evidence pack is 82% complete.
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/70">
        <div className="flex items-center gap-3 rounded-2xl bg-sidebar-accent/50 p-3">
          <Avatar className="size-10">
            <AvatarFallback>{advisorProfile.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {advisorProfile.name}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              {advisorProfile.email}
            </p>
          </div>
          <IconArrowUpRight className="size-4 text-sidebar-foreground/70" />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
