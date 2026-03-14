# AGENTS.md

This file is the fast-path orientation for coding agents working in `wealthflow-pro`.

## Project Summary

- Product: advisor CRM and operations workspace for wealth-management firms
- Frontend status: UI is mostly a seeded demo driven by [`src/lib/mock-data.ts`](src/lib/mock-data.ts)
- Backend status: Supabase schema, RLS, storage rules, and seed tooling are already present in [`supabase/migrations/20260314123000_wealthflow_core.sql`](supabase/migrations/20260314123000_wealthflow_core.sql) and [`scripts/seed-wealthflow.mjs`](scripts/seed-wealthflow.mjs)
- Architecture style: Next.js 16 App Router with a shared app shell and thin route pages

## Exact Commands

Use npm. The repo ships with `package-lock.json`.

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
npm run seed:wealthflow
```

## Repo Structure

```text
src/app/
  layout.tsx            Root layout, metadata, theme and tooltip providers
  page.tsx              Redirects / to /dashboard
  (app)/                Main authenticated shell routes
  (auth)/login/         Login route
src/components/
  shell/                App shell, sidebar, header, page header, branding
  shared/               Reusable dashboard widgets
  forms/                Login and settings forms
  ui/                   shadcn/ui source components
src/lib/
  mock-data.ts          Current UI data source
  navigation.ts         Sidebar nav model
  format.ts             Currency/date helpers
  supabase/             Browser/server client helpers
src/types/database.ts   Database typing used by Supabase helpers
src/proxy.ts            Supabase session refresh proxy
supabase/migrations/    Authoritative SQL schema and RLS rules
scripts/                Utility scripts, including seeding
```

## Architectural Constraints

- Keep the App Router structure intact. The root layout lives in [`src/app/layout.tsx`](src/app/layout.tsx), and the main product shell lives in [`src/app/(app)/layout.tsx`](src/app/(app)/layout.tsx).
- Treat pages and layouts as Server Components by default. Add `"use client"` only when the file needs state, effects, browser APIs, event handlers, or client-only hooks.
- Reuse the shell primitives before inventing new layout systems:
  - [`src/components/shell/app-shell.tsx`](src/components/shell/app-shell.tsx)
  - [`src/components/shell/app-header.tsx`](src/components/shell/app-header.tsx)
  - [`src/components/shell/app-sidebar.tsx`](src/components/shell/app-sidebar.tsx)
  - [`src/components/shell/page-header.tsx`](src/components/shell/page-header.tsx)
- The current product screens read from [`src/lib/mock-data.ts`](src/lib/mock-data.ts). Do not partially mix mock data and live Supabase reads inside one surface without making the data source explicit and coherent.
- Supabase helpers already exist, but route pages do not currently query Supabase. If you start wiring live data, update the route, the types, and the related docs together.
- The SQL migration is the source of truth for database design. [`src/types/database.ts`](src/types/database.ts) currently covers only part of that schema.

## UI and Layout Rules

- Use components from [`src/components/ui`](src/components/ui) first. They are checked into the repo as source.
- Use the repo alias style: `@/components/...`, `@/lib/...`, `@/hooks/...`.
- Keep page composition consistent:
  - top-level route container uses a simple vertical stack
  - start pages with `PageHeader`
  - dashboard-like summaries use a `grid gap-4 lg:grid-cols-3`
  - primary surfaces are `Card`, `Tabs`, `Table`, `Dialog`, `Badge`, and `Avatar`
  - table and analytics surfaces usually live inside a `Card` with a bordered `CardHeader` and padded `CardContent`
- Use semantic tokens from [`src/app/globals.css`](src/app/globals.css). Do not introduce hard-coded one-off color systems.
- Use Tabler icons, matching the existing imports from `@tabler/icons-react`.
- Preserve the current sidebar model in [`src/lib/navigation.ts`](src/lib/navigation.ts) when adding or renaming core routes.
- Preserve sidebar behavior: desktop collapses to icon mode, mobile uses a `Sheet`, and shared route metadata comes from `primaryNavigation`.
- For fuller visual guidance, read [`docs/ui-guidelines.md`](docs/ui-guidelines.md) before changing shell or dashboard layouts.

## Coding Standards

- TypeScript is `strict`; keep types explicit when data shape matters.
- Prefer small presentational route files that compose shared components.
- Keep formatting logic in [`src/lib/format.ts`](src/lib/format.ts) instead of scattering `Intl` calls across pages.
- Keep navigation metadata in [`src/lib/navigation.ts`](src/lib/navigation.ts), not inline in the sidebar.
- When changing database-facing code, use the existing Supabase wrappers in [`src/lib/supabase/server.ts`](src/lib/supabase/server.ts) and [`src/lib/supabase/browser.ts`](src/lib/supabase/browser.ts).

## Boundaries

- Do not commit `.env*` files or secrets.
- Do not edit files under `src/components/ui` unless the change is a deliberate design-system or primitive behavior change.
- Do not rewrite the migration history casually. Add new migrations instead of mutating old ones unless the user explicitly wants a reset.
- Do not change the seed credentials or demo data shape casually; those values are part of the current walkthrough flow.
- Do not delete the product reference artifact [`wealthflow_SRS_DOC.pdf`](wealthflow_SRS_DOC.pdf) unless explicitly asked.

## Testing Expectations

- Minimum check after code changes: `npm run lint`
- Prefer `npm run build` when you change routing, providers, proxy behavior, or type boundaries.
- Manually verify these routes when touching shared shell or navigation code:
  - `/login`
  - `/dashboard`
  - `/clients`
  - `/clients/[id]`
  - `/settings`
- The repository currently has no dedicated unit or e2e test suite. If you add non-trivial business logic, add tests or document why the change remains untested.

## Known Caveats

- [`src/proxy.ts`](src/proxy.ts) contains the intended Supabase session refresh logic, but the matcher is exported as `proxyConfig` rather than Next.js' standard `config`. Validate proxy behavior before assuming the matcher is active.
- [`src/types/database.ts`](src/types/database.ts) is behind the SQL migration and omits several tables and views already defined in the database.
- [`src/features`](src/features) exists but is currently unused; most features still live in route files plus shared components.

## Recommended Reading Order

1. [`package.json`](package.json)
2. [`src/app/layout.tsx`](src/app/layout.tsx)
3. [`src/components/shell/app-shell.tsx`](src/components/shell/app-shell.tsx)
4. [`src/lib/mock-data.ts`](src/lib/mock-data.ts)
5. [`supabase/migrations/20260314123000_wealthflow_core.sql`](supabase/migrations/20260314123000_wealthflow_core.sql)
6. [`docs/architecture.md`](docs/architecture.md)
