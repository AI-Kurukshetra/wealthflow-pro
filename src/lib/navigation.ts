import {
  IconCalendarTime,
  IconChecklist,
  IconFileText,
  IconLayoutDashboard,
  IconPigMoney,
  IconPresentationAnalytics,
  IconSettings,
  IconUsers,
  type Icon,
} from "@tabler/icons-react";

export type AppNavItem = {
  href: string;
  label: string;
  icon: Icon;
  description: string;
};

export const primaryNavigation: AppNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: IconLayoutDashboard,
    description: "Firm pulse and daily priorities",
  },
  {
    href: "/clients",
    label: "Clients",
    icon: IconUsers,
    description: "Households, notes, and relationships",
  },
  {
    href: "/portfolios",
    label: "Portfolios",
    icon: IconPigMoney,
    description: "AUM, holdings, and performance",
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: IconChecklist,
    description: "Operational follow-ups and reviews",
  },
  {
    href: "/meetings",
    label: "Meetings",
    icon: IconCalendarTime,
    description: "Reviews, prep, and next steps",
  },
  {
    href: "/documents",
    label: "Documents",
    icon: IconFileText,
    description: "Private files and compliance packs",
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: IconPresentationAnalytics,
    description: "Firm performance and advisor trends",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: IconSettings,
    description: "Firm profile and notifications",
  },
];
