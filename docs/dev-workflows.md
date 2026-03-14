# Dev Workflows

## Local Development

Use npm for all project commands.

```bash
npm install
npm run dev
```

The app starts on the standard Next.js dev server. The current UI works without live Supabase data because most screens render from [`src/lib/mock-data.ts`](../src/lib/mock-data.ts).

## Daily Workflow

1. Read [`package.json`](../package.json) for available commands.
2. Identify whether the target surface is mock-backed or Supabase-backed.
3. Inspect the relevant route under [`src/app`](../src/app), then the shared shell or component dependencies it uses.
4. Make the smallest coherent change.
5. Run validation commands.
6. Update docs if the architecture, workflow, or data model changed.

## How to Approach Changes

### UI Change

- start with the route file
- check whether the route already uses `PageHeader`, `Card`, `Table`, `Tabs`, or a shared widget
- prefer extending existing shell/shared components before adding new visual systems

### Navigation or Shell Change

- inspect [`src/components/shell/app-shell.tsx`](../src/components/shell/app-shell.tsx)
- inspect [`src/components/shell/app-header.tsx`](../src/components/shell/app-header.tsx)
- inspect [`src/components/shell/app-sidebar.tsx`](../src/components/shell/app-sidebar.tsx)
- update [`src/lib/navigation.ts`](../src/lib/navigation.ts) for top-level nav changes

### Data Integration Change

- decide whether the route is graduating from mock data to Supabase
- use [`src/lib/supabase/server.ts`](../src/lib/supabase/server.ts) for server reads and [`src/lib/supabase/browser.ts`](../src/lib/supabase/browser.ts) for client-side access only when necessary
- keep formatting in [`src/lib/format.ts`](../src/lib/format.ts)
- update [`src/types/database.ts`](../src/types/database.ts) if new tables or views are used

### Database Change

- add a new migration under [`supabase/migrations`](../supabase/migrations)
- avoid rewriting the existing migration unless the user explicitly wants a reset
- update the seed script if the new table or constraint affects demo data
- document the change in [`docs/database.md`](./database.md) if it affects table responsibilities or tenancy

## Testing Process

Current baseline checks:

```bash
npm run lint
npm run build
```

What to use when:

- always run `npm run lint` after code changes
- run `npm run build` for routing, provider, proxy, or cross-cutting changes
- manually verify important routes when shell or nav changes are involved:
  - `/login`
  - `/dashboard`
  - `/clients`
  - `/clients/[id]`
  - `/settings`

The repo currently has no dedicated unit-test or e2e-test command. If you add logic-heavy features, add tests or leave a clear note about the testing gap.

## Seeding Workflow

Use this only when you have a Supabase project configured:

1. apply the migration
2. set the required environment variables
3. run:

```bash
npm run seed:wealthflow
```

The seed script is deterministic and uses stable UUID generation to keep repeated upserts predictable.

## Commit Practices

- keep commits scoped to one concern
- separate docs-only changes from product code when practical
- do not commit `.env` files or tokens
- mention when a change is mock-only versus database-backed
- if you touch shared shell or database foundations, mention affected routes in the commit message

## Agent-Specific Guidance

- assume strict TypeScript and App Router defaults
- prefer server components unless interactivity requires a client boundary
- avoid introducing a second design language; this repo already has one
- call out caveats instead of silently papering over them, especially for Supabase typing gaps and proxy behavior
- when you change architecture, update [`AGENTS.md`](../AGENTS.md) and the relevant file in `docs/`
