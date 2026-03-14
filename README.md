# WealthFlow Pro

WealthFlow Pro is a Next.js 16 advisor workspace for wealth-management teams. The current repository combines a polished App Router dashboard shell and seeded demo flows with a richer Supabase data model that is ready to back the product once the UI is wired off mock data.

## Product Overview

- CRM views for client households and relationship activity
- Portfolio and transaction tracking
- Tasks, meetings, documents, and compliance surfaces
- Settings and analytics screens for advisor operations

Today, the frontend mostly renders from [`src/lib/mock-data.ts`](src/lib/mock-data.ts), while the database foundation lives in [`supabase/migrations/20260314123000_wealthflow_core.sql`](supabase/migrations/20260314123000_wealthflow_core.sql) and the seed script in [`scripts/seed-wealthflow.mjs`](scripts/seed-wealthflow.mjs).

## Tech Stack

- Next.js 16 App Router with React 19 and TypeScript
- Tailwind CSS v4
- shadcn/ui with the `radix-nova` preset
- Tabler icons
- React Hook Form with Zod validation
- Supabase for auth, Postgres, and Storage

Key entry points:

- App shell: [`src/components/shell/app-shell.tsx`](src/components/shell/app-shell.tsx)
- Root layout: [`src/app/layout.tsx`](src/app/layout.tsx)
- Auth proxy: [`src/proxy.ts`](src/proxy.ts)
- Supabase clients: [`src/lib/supabase/server.ts`](src/lib/supabase/server.ts), [`src/lib/supabase/browser.ts`](src/lib/supabase/browser.ts)

## Repository Shape

```text
src/
  app/              Next.js routes and layouts
  components/       Shell, shared widgets, forms, shadcn UI primitives
  lib/              Mock data, formatters, navigation, Supabase helpers
  types/            Database typing
supabase/
  migrations/       SQL schema and RLS policies
scripts/
  seed-wealthflow.mjs
docs/
  architecture.md
  database.md
  dev-workflows.md
  ui-guidelines.md
```

## Setup

### Prerequisites

- Node.js 20+
- npm
- Optional: a Supabase project if you want auth/session refresh and seeded database data

### Install

```bash
npm install
```

### Environment Variables

For local UI development, the app can render without Supabase credentials because the pages use mock data. For auth refresh and database seeding, add the following variables to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
```

`SUPABASE_SERVICE_ROLE_KEY` is also accepted by the seed script as a fallback secret key name.

## Development Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
npm run seed:wealthflow
```

What each command does:

- `npm run dev`: starts the Next.js dev server
- `npm run lint`: runs the repo ESLint config
- `npm run build`: creates the production build
- `npm run start`: serves the built app
- `npm run seed:wealthflow`: upserts demo tenant data into Supabase

## Database and Seeding

1. Apply the SQL in [`supabase/migrations/20260314123000_wealthflow_core.sql`](supabase/migrations/20260314123000_wealthflow_core.sql) to your Supabase project.
2. Set the required environment variables.
3. Run:

```bash
npm run seed:wealthflow
```

The seed script creates a demo advisor user, one organization, memberships, clients, portfolios, tasks, meetings, documents, compliance records, activities, and audit logs.

## Deployment

1. Install dependencies with `npm install`.
2. Run `npm run build`.
3. Provision a Supabase project and apply the migration.
4. Configure runtime environment variables for the Next.js app:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
5. Deploy the built app with `npm run start` on Node, or through a platform that supports Next.js 16.
6. Seed only non-production environments unless you explicitly want demo data in production.

## Further Reading

- Architecture: [`docs/architecture.md`](docs/architecture.md)
- Database model: [`docs/database.md`](docs/database.md)
- UI rules: [`docs/ui-guidelines.md`](docs/ui-guidelines.md)
- Dev workflow: [`docs/dev-workflows.md`](docs/dev-workflows.md)
- Agent instructions: [`AGENTS.md`](AGENTS.md)
