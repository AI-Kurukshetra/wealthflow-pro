# UI Guidelines

## Foundation

The UI stack is:

- shadcn/ui source components in [`src/components/ui`](../src/components/ui)
- Tailwind CSS v4 and design tokens in [`src/app/globals.css`](../src/app/globals.css)
- Geist Sans and Geist Mono from [`src/app/fonts.ts`](../src/app/fonts.ts)
- Tabler icons across shell and feature screens

The visual direction is a clean advisory dashboard with soft card surfaces, rounded corners, muted borders, and green-teal primary accents.

## Global Styling Rules

- Use semantic tokens from [`src/app/globals.css`](../src/app/globals.css): `bg-background`, `bg-card`, `text-muted-foreground`, `border-border`, `bg-sidebar`, and the chart tokens.
- Keep radii aligned with the existing scale. Most primary surfaces use `rounded-2xl`.
- Preserve the background treatment from `body` in `globals.css`; do not replace it with flat one-off page backgrounds inside the app shell.
- Keep icon usage consistent with `@tabler/icons-react`.

## shadcn/ui Usage

Prefer existing source components before adding custom markup:

- layout and data display: `Card`, `Table`, `Tabs`, `Badge`, `Avatar`, `Separator`
- interaction: `Button`, `Dialog`, `DropdownMenu`, `Select`, `Tooltip`, `Sheet`
- forms: `Form`, `FormField`, `FormItem`, `Input`, `Select`
- shell: `Sidebar` primitives in [`src/components/ui/sidebar.tsx`](../src/components/ui/sidebar.tsx)

Use the existing import style:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
```

## Core Page Pattern

Most app routes follow this structure:

1. top-level wrapper with a simple vertical stack
2. [`PageHeader`](../src/components/shell/page-header.tsx)
3. one or more cards, grids, tabs, or tables

Examples:

- [`src/app/(app)/dashboard/page.tsx`](../src/app/%28app%29/dashboard/page.tsx)
- [`src/app/(app)/clients/page.tsx`](../src/app/%28app%29/clients/page.tsx)
- [`src/app/(app)/analytics/page.tsx`](../src/app/%28app%29/analytics/page.tsx)

## Dashboard Grid Rules

Use the dashboard page as the reference layout:

- metric summaries use a `grid gap-4 lg:grid-cols-3`
- mixed analytical sections use a two-column split with a larger primary panel and a narrower secondary panel
- tabular sections live inside full-width `Card` containers
- `CardHeader` commonly gets `border-b border-border/60`
- `CardContent` commonly starts with `pt-4` or `pt-5`

If you add a new dashboard-like route, stay close to these proportions before inventing a new layout grammar.

## Sidebar Behavior

The navigation system is defined by:

- [`src/components/shell/app-sidebar.tsx`](../src/components/shell/app-sidebar.tsx)
- [`src/components/ui/sidebar.tsx`](../src/components/ui/sidebar.tsx)
- [`src/lib/navigation.ts`](../src/lib/navigation.ts)

Rules:

- desktop sidebar uses `variant="inset"` and `collapsible="icon"`
- mobile sidebar renders as a `Sheet`
- collapsed desktop state keeps tooltips and compact brand/avatar affordances
- sidebar state is persisted in a `sidebar_state` cookie
- keyboard shortcut: `Cmd/Ctrl + B`
- add or remove top-level routes by changing `primaryNavigation` instead of hard-coding links in the sidebar

## Header Behavior

[`src/components/shell/app-header.tsx`](../src/components/shell/app-header.tsx) is sticky and should remain the single place for:

- current-page labeling
- global search
- notifications
- theme switching
- advisor identity summary

Do not duplicate these controls inside route pages unless a route has a specific local action.

## Typography and Spacing

Page-title system from [`PageHeader`](../src/components/shell/page-header.tsx):

- eyebrow: small uppercase tracking-heavy label
- title: `text-3xl` to `text-4xl`, semibold, tight tracking
- description: muted copy, `text-sm` to `text-base`

Spacing conventions already used throughout the repo:

- route-level vertical spacing: `space-y-6` or close variants
- grid gaps: `gap-4`
- compact content clusters inside cards: `space-y-3` to `space-y-4`
- shell padding: set by [`src/components/shell/app-shell.tsx`](../src/components/shell/app-shell.tsx), not per-page duplication

## Forms

Current forms live in:

- [`src/components/forms/login-form.tsx`](../src/components/forms/login-form.tsx)
- [`src/components/forms/settings-form.tsx`](../src/components/forms/settings-form.tsx)

Follow the existing pattern:

- `react-hook-form` + `zodResolver`
- shadcn `Form` primitives
- inline icons only where they aid scanability
- large submit button at the end of the form

## Theming

Theme behavior is handled by:

- [`src/components/theme/theme-provider.tsx`](../src/components/theme/theme-provider.tsx)
- [`src/components/theme/theme-toggle.tsx`](../src/components/theme/theme-toggle.tsx)

Keep theme-aware styling token-based. Avoid route-specific hard-coded `dark:` overrides when a token already exists.
