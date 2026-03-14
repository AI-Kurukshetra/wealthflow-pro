"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconArrowUpRight,
  IconFolderCheck,
  IconShieldCheck,
} from "@tabler/icons-react";

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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { BrandMark } from "@/components/shell/brand-mark";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AppSidebarProps = {
  viewer: {
    name: string;
    email: string;
    title: string;
    initials: string;
    organizationName: string;
    organizationLocation: string;
  };
};

export function AppSidebar({ viewer }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar
      className="overflow-x-hidden"
      collapsible="icon"
      variant="inset"
    >
      <SidebarHeader className="overflow-x-hidden gap-3 border-b border-sidebar-border/70">
        <div className="max-h-44 min-w-0 overflow-hidden transition-[max-height,opacity,transform] duration-200 ease-out group-data-[collapsible=icon]:max-h-0 group-data-[collapsible=icon]:translate-y-1 group-data-[collapsible=icon]:opacity-0">
          <div className="flex items-start justify-between gap-3">
            <BrandMark className="min-w-0" />
            <Badge className="shrink-0" variant="secondary">
              MVP
            </Badge>
          </div>
          <div className="mt-3 min-w-0 rounded-2xl border border-sidebar-border/80 bg-sidebar-primary/8 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-sidebar-foreground">
                  {viewer.organizationName}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/70">
                  {viewer.organizationLocation}
                </p>
              </div>
              <Badge className="shrink-0" variant="secondary">
                MVP
              </Badge>
            </div>
          </div>
        </div>
        <div className="pointer-events-none -mt-14 flex items-center justify-center opacity-0 transition-[margin,opacity] duration-200 ease-out group-data-[collapsible=icon]:pointer-events-auto group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:opacity-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/35 p-2.5">
                <BrandMark compact className="justify-center" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="space-y-1">
                <p className="font-medium">{viewer.organizationName}</p>
                <p className="text-[11px] text-background/70">
                  Advisor intelligence cockpit
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
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
                      <Link
                        className="flex min-w-0 items-center"
                        href={item.href}
                      >
                        <item.icon className="shrink-0" />
                        <span className="ml-2 min-w-0 max-w-40 truncate transition-[max-width,opacity,margin] duration-200 ease-out group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
                          {item.label}
                        </span>
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
          <SidebarGroupContent className="max-h-52 overflow-hidden transition-[max-height,opacity,transform] duration-200 ease-out group-data-[collapsible=icon]:max-h-0 group-data-[collapsible=icon]:translate-y-1 group-data-[collapsible=icon]:opacity-0">
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
          <div className="pointer-events-none -mt-10 flex justify-center px-2 opacity-0 transition-[margin,opacity] duration-200 ease-out group-data-[collapsible=icon]:pointer-events-auto group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:opacity-100">
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
      <SidebarFooter className="overflow-x-hidden border-t border-sidebar-border/70">
        <div className="flex max-h-24 min-w-0 items-center gap-3 overflow-hidden rounded-2xl bg-sidebar-accent/50 p-3 transition-[max-height,opacity,transform] duration-200 ease-out group-data-[collapsible=icon]:max-h-0 group-data-[collapsible=icon]:translate-y-1 group-data-[collapsible=icon]:opacity-0">
          <Avatar className="size-10">
            <AvatarFallback>{viewer.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {viewer.name}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              {viewer.email}
            </p>
          </div>
          <IconArrowUpRight className="size-4 text-sidebar-foreground/70" />
        </div>
        <div className="pointer-events-none -mt-12 flex justify-center opacity-0 transition-[margin,opacity] duration-200 ease-out group-data-[collapsible=icon]:pointer-events-auto group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:opacity-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={viewer.name}
                className="size-12 rounded-2xl bg-sidebar-accent/40 hover:bg-sidebar-accent"
                size="icon-lg"
                variant="ghost"
              >
                <Avatar className="size-10">
                  <AvatarFallback>{viewer.initials}</AvatarFallback>
                </Avatar>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="space-y-1">
                <p className="font-medium">{viewer.name}</p>
                <p className="text-[11px] leading-4 text-background/70">
                  {viewer.title}
                </p>
                <p className="text-[11px] leading-4 text-background/70">
                  {viewer.email}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
