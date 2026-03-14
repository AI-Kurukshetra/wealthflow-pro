"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconArrowUpRight,
  IconFolderCheck,
  IconShieldCheck,
} from "@tabler/icons-react";

import { advisorProfile } from "@/lib/mock-data";
import { primaryNavigation } from "@/lib/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="gap-4 border-b border-sidebar-border/70">
        <div className="group-data-[collapsible=icon]:hidden">
          <div className="flex items-start justify-between gap-3">
            <BrandMark />
            <Badge variant="secondary">MVP</Badge>
          </div>
          <div className="mt-4 rounded-2xl border border-sidebar-border/80 bg-sidebar-primary/8 p-3 text-sm">
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
        </div>
        <div className="hidden items-center justify-center group-data-[collapsible=icon]:flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/35 p-2.5">
                <BrandMark compact className="justify-center" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="space-y-1">
                <p className="font-medium">{advisorProfile.firm}</p>
                <p className="text-[11px] text-background/70">
                  Advisor intelligence cockpit
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
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
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={{
                        children: (
                          <div className="space-y-1">
                            <p className="font-medium">{item.label}</p>
                            <p className="max-w-44 text-[11px] leading-4 text-background/70">
                              {item.description}
                            </p>
                          </div>
                        ),
                      }}
                    >
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
          <SidebarGroupContent className="group-data-[collapsible=icon]:hidden">
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
          <div className="hidden justify-center px-2 group-data-[collapsible=icon]:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Compliance queue summary"
                  className="rounded-2xl border-sidebar-border/70 bg-sidebar-accent/40 text-sidebar-foreground hover:bg-sidebar-accent"
                  size="icon"
                  variant="outline"
                >
                  <IconShieldCheck className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="space-y-1">
                  <p className="font-medium">Compliance queue</p>
                  <p className="max-w-48 text-[11px] leading-4 text-background/70">
                    3 reviews require attention before month-end cut-off.
                  </p>
                  <p className="max-w-48 text-[11px] leading-4 text-background/70">
                    SEBI evidence pack is 82% complete.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/70">
        <div className="flex items-center gap-3 rounded-2xl bg-sidebar-accent/50 p-3 group-data-[collapsible=icon]:hidden">
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
        <div className="hidden justify-center group-data-[collapsible=icon]:flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={advisorProfile.name}
                className="size-12 rounded-2xl bg-sidebar-accent/40 hover:bg-sidebar-accent"
                size="icon-lg"
                variant="ghost"
              >
                <Avatar className="size-10">
                  <AvatarFallback>{advisorProfile.initials}</AvatarFallback>
                </Avatar>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="space-y-1">
                <p className="font-medium">{advisorProfile.name}</p>
                <p className="text-[11px] leading-4 text-background/70">
                  {advisorProfile.title}
                </p>
                <p className="text-[11px] leading-4 text-background/70">
                  {advisorProfile.email}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
