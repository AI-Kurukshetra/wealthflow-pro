"use client";

import { usePathname } from "next/navigation";
import {
  IconBell,
  IconSearch,
  IconSparkles,
} from "@tabler/icons-react";

import { advisorProfile, notifications } from "@/lib/mock-data";
import { primaryNavigation } from "@/lib/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme/theme-toggle";

function getPageLabel(pathname: string) {
  const exact = primaryNavigation.find((item) => item.href === pathname);
  if (exact) {
    return exact.label;
  }

  if (pathname.startsWith("/clients/")) {
    return "Client profile";
  }

  return "Workspace";
}

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 h-16 shrink-0 border-b border-border/70 bg-background/92 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-4 md:gap-3 md:px-6">
        <SidebarTrigger />
        <div className="min-w-0 flex-1">
          <p className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-primary lg:block">
            WealthFlow workspace
          </p>
          <p className="truncate text-sm font-medium text-foreground md:text-base">
            {getPageLabel(pathname)}
          </p>
        </div>
        <div className="relative hidden w-full max-w-md lg:block">
          <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="global-search"
            name="globalSearch"
            type="search"
            autoComplete="off"
            aria-label="Search households, tasks, or documents"
            className="h-10 rounded-xl border-border/70 bg-card/80 pl-10 shadow-sm shadow-black/5"
            placeholder="Search households, tasks, or documents"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon-sm" variant="outline">
              <IconBell />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>
                Actionable reminders aligned with the WealthFlow operating model.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-xl border border-border/70 bg-muted/30 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Prioritize this inside your morning advisory sweep.
                      </p>
                    </div>
                    <Badge variant="secondary">{notification.kind}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <ThemeToggle />
        <Button
          aria-label={advisorProfile.name}
          className="hidden rounded-full border-border/70 bg-card/90 shadow-sm shadow-black/5 md:inline-flex xl:hidden"
          size="icon"
          variant="outline"
        >
          <Avatar className="size-8">
            <AvatarFallback>{advisorProfile.initials}</AvatarFallback>
          </Avatar>
        </Button>
        <div className="hidden items-center gap-3 rounded-2xl border border-border/70 bg-card/90 px-3.5 py-2 shadow-sm shadow-black/5 xl:flex">
          <Avatar className="size-9">
            <AvatarFallback>{advisorProfile.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{advisorProfile.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {advisorProfile.title}
            </p>
          </div>
          <Badge variant="outline" className="gap-1">
            <IconSparkles className="size-3" />
            Live
          </Badge>
        </div>
      </div>
    </header>
  );
}
