# WealthFlow Pro

> A multi-tenant advisor CRM and operations workspace for wealth-management firms. It combines client relationship management, portfolio tracking, task management, meetings, document handling, and analytics/compliance-oriented surfaces.

---

## 🚀 Current Product Status

Most authenticated product routes are now live Supabase-backed (server-rendered reads + client-side mutations), rather than mock-backed.

**Live Surfaces:**
* Dashboard
* Clients and client detail
* Portfolios
* Tasks
* Meetings
* Documents (including signed download flow)
* Setup/bootstrap workspace flow
* Login/session-protected shell

**Demo / UI-Only Surfaces:**
* Analytics page (mock-backed)
* Settings page (form-only, no persistence)

---

## 💻 Tech Stack

* **Framework:** Next.js 16 App Router + React 19
* **Language:** TypeScript (strict)
* **Styling:** Tailwind CSS v4 + tw-animate-css
* **Components:** shadcn/ui source components + Radix primitives + Tabler icons
* **Forms:** React Hook Form + Zod
* **Backend/Auth:** Supabase Auth + Postgres + Storage
* **Testing:** Jest + React Testing Library, Playwright E2E
* **CI:** GitHub Actions (lint + unit + e2e)

---

## 🛠️ Quick Start Guide

Follow these steps to get the app running locally.

**Prerequisites:** Node.js 20+, npm, and a Supabase project.

### Step 1: Install Dependencies
```bash
npm install

```

### Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials. The app requires this to function.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_secret_key
# Note: Use SUPABASE_SERVICE_ROLE_KEY as a fallback for the seed script if needed.

```

### Step 3: Set Up the Database

Apply the Supabase migrations in this exact order:

1. `supabase/migrations/20260314123000_wealthflow_core.sql`
2. `supabase/migrations/20260314171000_wealthflow_auth_bootstrap.sql`

### Step 4: Seed Demo Data

Populate your database with demo data (organizations, memberships, clients, portfolios, tasks, etc.).

```bash
npm run seed:wealthflow

```

* **Demo Email:** `vineeth.motati@wealthflow.in`
* **Demo Password:** `WealthFlow123!`
*(Note: The CLI seed inserts document metadata rows but does not upload storage objects. The in-app setup flow uploads sample document files but omits compliance/audit records.)*

### Step 5: Run the App

```bash
npm run dev

```

**Important Routes:**

* `/login` - Authentication
* `/setup` - First-time workspace provisioning
* `/dashboard` - Main app entry after login

---

## 📜 Useful Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Build the production application |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests (Jest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run seed:wealthflow` | Seed the database with demo data |

---

## 📁 Repository Structure

```text
src/
  app/                    App Router routes, layouts, route handlers
    (app)/                Authenticated product shell routes
    (auth)/login/         Login route
    api/                  Route handlers (document download signing)
  components/
    shell/                App shell, sidebar, header, page header
    shared/               Reusable widgets (metrics, chart)
    forms/                Login and settings forms
    clients/              Client create/edit dialog
    tasks/                Task workspace
    documents/            Document upload dialog
    ui/                   Checked-in shadcn/ui primitives
  lib/
    auth/                 Auth server actions
    supabase/             Browser/server Supabase clients + env helpers
    wealthflow/           Server query layer + demo workspace provisioning
    mock-data.ts          Mock data still used by analytics
  types/
    database.ts           Supabase TypeScript DB types
supabase/
  migrations/             Authoritative schema, RLS, auth bootstrap
scripts/
  seed-wealthflow.mjs     CLI seed tool
docs/                     Documentation files

```

---

## 🏗️ Architecture Notes

* **Route protection & session refresh:** Managed in middleware.
* **Auth server actions:** Located in `actions.ts`.
* **Live server query layer:** Handled in `server.ts`.
* **Demo workspace bootstrap action:** Located in `actions.ts`.
* **Document download signing:** Managed via API `route.ts`.

---

## 🧪 Testing and CI

**Local Testing:** Run `npm run lint`, `npm run test`, and `npm run test:e2e` before committing.

**CI Workflow (GitHub Actions):**

1. `npm ci`
2. `npm run lint`
3. `npm run test`
4. Playwright browser install
5. `npm run test:e2e`

---

## ⚠️ Known Gaps

* **Analytics:** Currently mock-backed; not yet wired to live Supabase queries.
* **Settings:** Form has no persistence layer yet.
* **Missing Pages:** No dedicated views for goals, compliance records, audit logs, risk profiles, or membership management.
* **Search/Filters:** Header/client search and filter controls are placeholders.
* **Read-Only Data:** Meetings and portfolios cannot currently be created, edited, or deleted in the UI.

---

## 📚 Additional Documentation

For deeper technical details, check the `/docs` folder:

* `system-context.md`
* `architecture.md`
* `database.md`
* `dev-workflows.md`
* `ui-guidelines.md`
* `AGENTS.md`
