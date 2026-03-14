# Architecture

## System Snapshot

WealthFlow Pro is a Next.js 16 App Router application with a shared dashboard shell, a login route, and a Supabase backend foundation. The current frontend mostly renders seeded demo data from [`src/lib/mock-data.ts`](../src/lib/mock-data.ts), while the long-term source of truth for data shape and permissions lives in [`supabase/migrations/20260314123000_wealthflow_core.sql`](../supabase/migrations/20260314123000_wealthflow_core.sql).

At a high level:

- routing and layouts live in [`src/app`](../src/app)
- reusable UI and shell code live in [`src/components`](../src/components)
- app-level data helpers and formatting live in [`src/lib`](../src/lib)
- unit and component tests live in [`src/test`](../src/test)
- end-to-end tests live in [`e2e`](../e2e)
- auth/session refresh is prepared in [`src/proxy.ts`](../src/proxy.ts)
- Supabase schema and policies live in [`supabase/migrations`](../supabase/migrations)

## Layered Structure

### 1. Routing Layer

The app uses the App Router under [`src/app`](../src/app):

- [`src/app/layout.tsx`](../src/app/layout.tsx): root layout, global metadata, theme provider, tooltip provider, and global CSS
- [`src/app/page.tsx`](../src/app/page.tsx): redirects `/` to `/dashboard`
- [`src/app/(app)/layout.tsx`](../src/app/(app)/layout.tsx): wraps product routes in the shared shell
- [`src/app/(auth)/login/page.tsx`](../src/app/%28auth%29/login/page.tsx): login experience

The route groups follow the standard Next.js convention where parenthesized folders organize routes without changing the URL path.

### 2. Shell Layer

The shared workspace UI lives in [`src/components/shell`](../src/components/shell):

- [`app-shell.tsx`](../src/components/shell/app-shell.tsx): composes `SidebarProvider`, `AppSidebar`, `AppHeader`, and the main scroll area
- [`app-sidebar.tsx`](../src/components/shell/app-sidebar.tsx): main navigation, compliance summary blocks, advisor footer
- [`app-header.tsx`](../src/components/shell/app-header.tsx): sticky header, page title, search field, notifications, theme toggle
- [`page-header.tsx`](../src/components/shell/page-header.tsx): reusable route heading pattern

This keeps route files thin and visually consistent.

### 3. Feature Presentation Layer

Route pages under [`src/app/(app)`](../src/app/%28app%29) compose shared primitives instead of owning much logic:

- dashboard: metrics, recent activity, chart, upcoming tasks
- clients: table, new-client dialog, detail tabs
- portfolios, tasks, meetings, documents: table-heavy operational views
- analytics: tabbed summary screen
- settings: form plus operational defaults card

The reusable display widgets currently live in [`src/components/shared`](../src/components/shared), especially [`metric-card.tsx`](../src/components/shared/metric-card.tsx) and [`portfolio-performance-chart.tsx`](../src/components/shared/portfolio-performance-chart.tsx).

### 4. Data and Utility Layer

- [`src/lib/mock-data.ts`](../src/lib/mock-data.ts): current in-memory source for UI content
- [`src/lib/navigation.ts`](../src/lib/navigation.ts): sidebar route metadata
- [`src/lib/format.ts`](../src/lib/format.ts): currency, percent, date, and datetime formatting
- [`src/lib/supabase`](../src/lib/supabase): browser/server client creation helpers

## Next.js Routing and Layout Patterns

The repository follows current App Router conventions:

- root `layout.tsx` wraps all routes
- nested `layout.tsx` files wrap only their subtree
- `loading.tsx` and `error.tsx` are scoped to the `(app)` group
- dynamic routes use async `params`, as shown in [`src/app/(app)/clients/[id]/page.tsx`](../src/app/%28app%29/clients/%5Bid%5D/page.tsx)

Concrete route map:

- `/login` -> [`src/app/(auth)/login/page.tsx`](../src/app/%28auth%29/login/page.tsx)
- `/dashboard` -> [`src/app/(app)/dashboard/page.tsx`](../src/app/%28app%29/dashboard/page.tsx)
- `/clients` -> [`src/app/(app)/clients/page.tsx`](../src/app/%28app%29/clients/page.tsx)
- `/clients/[id]` -> [`src/app/(app)/clients/[id]/page.tsx`](../src/app/%28app%29/clients/%5Bid%5D/page.tsx)
- `/portfolios`, `/tasks`, `/meetings`, `/documents`, `/analytics`, `/settings`

## Component Boundaries

Server Components by default:

- most route pages
- both layout files
- shared presentational components without hooks or browser APIs

Client Components where interactivity is needed:

- [`src/components/shell/app-sidebar.tsx`](../src/components/shell/app-sidebar.tsx)
- [`src/components/shell/app-header.tsx`](../src/components/shell/app-header.tsx)
- [`src/components/forms/login-form.tsx`](../src/components/forms/login-form.tsx)
- [`src/components/forms/settings-form.tsx`](../src/components/forms/settings-form.tsx)
- [`src/components/theme/theme-provider.tsx`](../src/components/theme/theme-provider.tsx)
- [`src/components/theme/theme-toggle.tsx`](../src/components/theme/theme-toggle.tsx)
- [`src/components/ui/sidebar.tsx`](../src/components/ui/sidebar.tsx)

This split matches the default Next.js model: render on the server unless local state, effects, browser APIs, or event handlers require a client boundary.

## Data Flow

### Current UI Flow

1. Route page imports data from [`src/lib/mock-data.ts`](../src/lib/mock-data.ts).
2. Route page formats values with [`src/lib/format.ts`](../src/lib/format.ts).
3. Route page renders mostly presentational components from `components/shared` and `components/ui`.

This means the current UI is deterministic and demo-friendly, but not yet backed by live database reads.

### Supabase Flow Prepared for Future Integration

- [`src/proxy.ts`](../src/proxy.ts) creates a server Supabase client, reads cookies, and calls `auth.getUser()` to refresh session state.
- [`src/lib/supabase/server.ts`](../src/lib/supabase/server.ts) builds a request-scoped server client.
- [`src/lib/supabase/browser.ts`](../src/lib/supabase/browser.ts) memoizes a browser client.
- [`src/types/database.ts`](../src/types/database.ts) provides typed table definitions for that integration.

Important: the live route pages do not currently call these helpers.

## Layout and Interaction Patterns

- The root layout injects theme and tooltip providers in [`src/app/layout.tsx`](../src/app/layout.tsx).
- The `(app)` layout mounts a persistent shell via [`src/components/shell/app-shell.tsx`](../src/components/shell/app-shell.tsx).
- The sidebar is collapsible on desktop and becomes a `Sheet` on mobile inside [`src/components/ui/sidebar.tsx`](../src/components/ui/sidebar.tsx).
- The header remains sticky while route content scrolls inside the `<main>` region created by `AppShell`.

## Testing Layer

- [`jest.config.ts`](../jest.config.ts) uses `next/jest` so Jest respects the Next.js compiler, aliases, and environment loading.
- [`jest.setup.ts`](../jest.setup.ts) centralizes DOM test setup needed by shadcn/radix primitives in jsdom.
- [`src/test/test-utils.tsx`](../src/test/test-utils.tsx) wraps component tests with the same theme, tooltip, and optional sidebar providers used by the app shell.
- [`playwright.config.ts`](../playwright.config.ts) runs cross-browser E2E coverage in Chromium, Firefox, and WebKit, with a local `baseURL` of `http://localhost:3000`.
- [`.github/workflows/tests.yml`](../.github/workflows/tests.yml) codifies the lint, Jest, and Playwright workflow for CI on Node 20.
- The current Playwright scope matches the app's shipped behavior. It covers login and route navigation, and leaves task creation as a skipped placeholder until that UI exists.

## Architectural Decisions

### Shared shell over per-page chrome

The repository centralizes navigation, header, and scroll behavior in the shell instead of repeating them in route files. This keeps route pages focused on content blocks.

### Mock-first frontend, database-first backend

The frontend is intentionally demoable without backend availability, but the SQL schema already models multi-tenant production data. That split explains why the UI is more complete than the live data plumbing.

### Design-system source in-repo

shadcn/ui components are checked into [`src/components/ui`](../src/components/ui), so agents can modify primitives locally when necessary instead of depending on runtime package behavior.

## Current Gaps to Be Aware Of

- The database migration defines more tables and views than [`src/types/database.ts`](../src/types/database.ts) currently exposes.
- [`src/features`](../src/features) is present but unused.
- [`src/proxy.ts`](../src/proxy.ts) follows the new Next.js `proxy.ts` convention, but its matcher export is named `proxyConfig`; verify behavior before depending on the matcher.
