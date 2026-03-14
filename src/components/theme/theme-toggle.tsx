"use client";

import * as React from "react";
import {
  IconCheck,
  IconDeviceDesktop,
  IconMoonStars,
  IconSunHigh,
} from "@tabler/icons-react";

import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themeOptions = [
  {
    value: "light",
    label: "Light",
    icon: IconSunHigh,
  },
  {
    value: "dark",
    label: "Dark",
    icon: IconMoonStars,
  },
  {
    value: "system",
    label: "System",
    icon: IconDeviceDesktop,
  },
] as const;

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const ActiveIcon = !mounted
    ? IconDeviceDesktop
    : resolvedTheme === "dark"
      ? IconMoonStars
      : IconSunHigh;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Toggle theme"
          className="rounded-xl"
          size="icon-sm"
          variant="outline"
        >
          <ActiveIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const selected = theme === option.value;

          return (
            <DropdownMenuItem
              key={option.value}
              className="justify-between"
              onClick={() => setTheme(option.value)}
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4" />
                {option.label}
              </span>
              {selected ? <IconCheck className="size-4 text-primary" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
