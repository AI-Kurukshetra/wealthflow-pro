# WealthFlow Pro Project Context

## 1. Project Overview

- Project name: WealthFlow Pro (repo/package name), with in-app branding shown as WealthFlow.
- Purpose: advisor CRM and operations workspace for wealth-management firms. The app combines
client relationship management, portfolio tracking, task management, meetings, document
handling, and analytics/compliance-oriented surfaces.
- Main user types observed in code/schema: owner, admin, advisor, associate, compliance.
- Business domain: multi-tenant wealth management / advisory operations.

Key references: package.json, README.md, src/components/shell/brand-mark.tsx, supabase/
migrations/20260314123000_wealthflow_core.sql

## 2. Tech Stack

- Frontend framework: Next.js 16.1.6 with App Router and React 19.2.3
- Language: TypeScript with strict mode enabled
- Styling: Tailwind CSS v4, PostCSS, tw-animate-css
- UI libraries: shadcn/ui source components, Radix UI primitives, Tabler icons
- Forms/validation: React Hook Form + Zod
- Backend services: Supabase via @supabase/supabase-js and @supabase/ssr
- Database: Supabase Postgres
- Auth system: Supabase Auth with SSR cookie handling
- Storage: Supabase Storage bucket client-documents
- Testing: Jest + React Testing Library for component tests; Playwright for E2E
- CI: GitHub Actions workflow for lint, Jest, and Playwright
- Deployment setup detected: standard Next.js build/start deployment; no repo-specific vercel.json
is present

Key references: components.json, tsconfig.json, playwright.config.ts, jest.config.ts, .github/
workflows/tests.yml

## 3. Repository Structure

- src/app
Purpose: App Router routes, layouts, route handlers, global styles, fonts.
- src/app/(app)
Purpose: authenticated product routes rendered inside the shared app shell.
- src/app/(auth)
Purpose: authentication route group; currently only /login.
- src/app/api
Purpose: Route Handlers; currently document download signing.
- src/components/shell
Purpose: shared application chrome: shell, header, sidebar, page header, brand mark.
- src/components/shared
Purpose: reusable dashboard/analytics widgets.
- src/components/forms
Purpose: login and settings forms.
- src/components/clients
Purpose: live client create/edit dialog.
- src/components/tasks
Purpose: live task workspace with create/complete flows.
- src/components/documents
Purpose: live document upload dialog.
- src/components/theme
Purpose: theme provider and theme switcher.
- src/components/ui
Purpose: checked-in shadcn/ui primitives used throughout the app.
- src/lib
Purpose: formatting, navigation, mock data, Supabase helpers, auth actions.
- src/lib/wealthflow
Purpose: server-side workspace query layer, demo bootstrap action, workspace seed builder.
- src/lib/supabase
Purpose: SSR/browser Supabase client creation and env helpers.
- src/types
Purpose: TypeScript database types used by Supabase helpers.
- src/test
Purpose: Jest test utilities and component tests.
- e2e
Purpose: Playwright end-to-end tests and shared helpers.
- supabase/migrations
Purpose: authoritative SQL schema, RLS policies, triggers, views, auth bootstrap logic.
- scripts
Purpose: CLI seed tooling.
- docs
Purpose: internal project docs; some are now partially stale relative to current code.
- .github/workflows
Purpose: CI workflow definition.
- public
Purpose: static assets; currently mostly default starter-style SVG assets.
- src/features
Purpose: present but unused in the current codebase.

Key references: src/app, src/components, src/lib, supabase/migrations

## 4. Implemented Features

### Authentication and session gate

- Description: email/password login via Supabase Auth, sign-out, authenticated route protection,
safe redirect handling, profile bootstrap trigger.
- Key files/components: src/app/(auth)/login/page.tsx, src/components/forms/login-form.tsx, src/
lib/auth/actions.ts, src/proxy.ts
- Related database tables: auth.users, profiles, organization_memberships, organizations

### Demo workspace provisioning

- Description: after login, a user without a workspace can provision a tenant, profile, risk
profiles, CRM data, portfolios, tasks, meetings, notifications, activities, and seeded storage-
backed documents.
- Key files/components: src/app/(app)/setup/page.tsx, src/lib/wealthflow/actions.ts, src/lib/
wealthflow/demo-data.ts
- Related database tables: organizations, profiles, risk_profiles, clients, portfolios, accounts,
securities, portfolio_snapshots, transactions, tasks, meetings, goals, notifications,
client_activities, documents

### Shared app shell

- Description: authenticated routes render inside a responsive shell with collapsible desktop
sidebar, mobile sheet sidebar, sticky header, notification dialog, and theme toggle.
- Key files/components: src/components/shell/app-shell.tsx, src/components/shell/app-sidebar.tsx,
src/components/shell/app-header.tsx, src/components/ui/sidebar.tsx
- Related database tables: notifications, profiles, organization_memberships, organizations

### Dashboard

- Description: live dashboard metrics, recent client activity, aggregated portfolio snapshot
chart, and upcoming tasks.
- Key files/components: src/app/(app)/dashboard/page.tsx, src/components/shared/metric-card.tsx,
src/components/shared/portfolio-performance-chart.tsx, src/lib/wealthflow/server.ts
- Related database tables/views: client_activities, tasks, portfolio_snapshots, clients,
advisor_dashboard_metrics_v

### Client management

- Description: live client roster with AUM rollup, next meeting lookup, drill-down into a client
profile, and create/edit client flows.
- Key files/components: src/app/(app)/clients/page.tsx, src/app/(app)/clients/[id]/page.tsx, src/
components/clients/client-upsert-dialog.tsx
- Related database tables/views: clients, meetings, portfolios, tasks, documents,
client_aum_summary_v

### Portfolio tracking

- Description: live portfolio ledger, latest performance badge from snapshot history, transaction
history, and aggregated performance chart.
- Key files/components: src/app/(app)/portfolios/page.tsx, src/components/shared/portfolio-
performance-chart.tsx
- Related database tables: portfolios, portfolio_snapshots, transactions, clients

### Task workspace

- Description: live task list, task creation dialog, and “mark complete” mutation.
- Key files/components: src/app/(app)/tasks/page.tsx, src/components/tasks/task-workspace.tsx
- Related database tables: tasks, clients, portfolios

### Meetings schedule

- Description: live meetings table with meeting type, client, channel, location, and status.
- Key files/components: src/app/(app)/meetings/page.tsx
- Related database tables: meetings, clients

### Document vault

- Description: live document listing, file upload to private storage, metadata persistence, and
signed download via Route Handler.
- Key files/components: src/app/(app)/documents/page.tsx, src/components/documents/document-
upload-dialog.tsx, src/app/api/documents/[id]/download/route.ts
- Related database tables/storage: documents, clients, client-documents bucket

### Analytics page

- Description: demo analytics screen with performance/service/compliance tabs; this page is mock-
backed, not live Supabase-backed.
- Key files/components: src/app/(app)/analytics/page.tsx, src/lib/mock-data.ts
- Related database tables: none directly queried by the page; conceptually mirrors
compliance_records, meetings, dashboard metrics

### Settings page

- Description: demo settings form and operational-defaults card; currently form-only UI with no
persistence.
- Key files/components: src/app/(app)/settings/page.tsx, src/components/forms/settings-form.tsx
- Related database tables: none directly queried or updated

### Theme system

- Description: light/dark/system theme toggle backed by localStorage.
- Key files/components: src/components/theme/theme-provider.tsx, src/components/theme/theme-
toggle.tsx
- Related database tables: none

## 5. UI Pages

| Route | Purpose | Main components | Data source |
| --- | --- | --- | --- |
| / | Redirect entrypoint | none; redirect only | redirects to /dashboard |
| /login | Auth entry screen; login or create demo workspace | BrandMark, LoginForm, Card, Badge |
Supabase auth session check; form submits to server action |
| /setup | One-time workspace bootstrap for authenticated users without membership | PageHeader,
Card, button form | live getViewerWorkspace() + provisionDemoWorkspaceAction() |
| /dashboard | Main advisor overview | PageHeader, MetricCard, PortfolioPerformanceChart, Card,
Table, Avatar, Badge | live Supabase via getDashboardData() |
| /clients | Client roster with create/edit dialog | PageHeader, ClientUpsertDialog, Table,
Avatar, Input, Select | live Supabase via getClientsPageData() |
| /clients/[id] | Client 360 profile with tabs | PageHeader, Tabs, Table, Card, Badge | live
Supabase via getClientDetailData(id) |
| /portfolios | Portfolio ledger and transaction history | PageHeader, PortfolioPerformanceChart,
Table, Badge, Card | live Supabase via getPortfoliosPageData() |
| /tasks | Task workspace with create and complete flows | PageHeader, TaskWorkspace, Card | live
Supabase via getTasksPageData() |
| /meetings | Upcoming meetings schedule | PageHeader, Table, Badge, Card | live Supabase via
getMeetingsPageData() |
| /documents | Document vault with upload/download | PageHeader, DocumentUploadDialog, Table,
Badge, Card | live Supabase via getDocumentsPageData() plus Route Handler for download |
| /analytics | Mock analytics and compliance view | PageHeader, Tabs, MetricCard,
PortfolioPerformanceChart, Table | src/lib/mock-data.ts |
| /settings | Mock workspace settings | PageHeader, SettingsForm, Card, Badge | form defaults
only; no backend writes |

Key references: src/app, src/lib/wealthflow/server.ts, src/lib/mock-data.ts

## 6. Database Schema (Supabase)

Authoritative schema: supabase/migrations/20260314123000_wealthflow_core.sql
Auth/bootstrap triggers: supabase/migrations/20260314171000_wealthflow_auth_bootstrap.sql

### Identity and tenancy tables

#### organizations

Fields: id uuid PK, name text, slug text unique, timezone text, base_currency text, country_code
text, created_by uuid -> auth.users.id, created_at timestamptz, updated_at timestamptz.
Relationships: parent for nearly all business tables; trigger creates owner membership after
insert.
Purpose: tenant workspace / advisory firm record.

#### profiles

Fields: id uuid PK -> auth.users.id, full_name text, email text unique, avatar_url text, phone
text, job_title text, created_at timestamptz, updated_at timestamptz.
Relationships: referenced by memberships, clients, portfolios, tasks, meetings, documents,
notifications, activities, compliance, audit logs.
Purpose: application profile for authenticated users.

#### organization_memberships

Fields: id uuid PK, organization_id uuid, user_id uuid, role text, status text, joined_at
timestamptz, created_by uuid, created_at timestamptz, updated_at timestamptz.
Relationships: joins profiles to organizations; unique on (organization_id, user_id).
Purpose: tenant membership and role model.

#### risk_profiles

Fields: id uuid PK, organization_id uuid, name text, description text, score_min integer,
score_max integer, created_by uuid, created_at timestamptz, updated_at timestamptz.
Relationships: belongs to organizations; clients.risk_profile stores a text profile label rather
than FK.
Purpose: tenant-level suitability/risk profile definitions.

### CRM tables

#### clients

Fields: id uuid PK, organization_id uuid, primary_advisor_id uuid, household_name text, first_name
text, last_name text, email text, phone text, date_of_birth date, city text, client_status text,
risk_profile text, source text, notes text, created_by uuid, created_at timestamptz, updated_at
timestamptz.
Relationships: parent of activities, portfolios, goals; referenced by tasks, meetings, documents,
transactions, compliance records.
Purpose: household/client CRM records.

#### client_activities

Fields: id uuid PK, organization_id uuid, client_id uuid, actor_id uuid, activity_type text, title
text, description text, occurred_at timestamptz, metadata jsonb, created_at timestamptz,
updated_at timestamptz.
Relationships: belongs to clients, organizations, and optionally profiles.
Purpose: client timeline / activity feed.

### Portfolio and market data tables

#### portfolios

Fields: id uuid PK, organization_id uuid, client_id uuid, advisor_id uuid, name text, account_type
text, custodian text, account_mask text, base_currency text, market_value numeric(14,2),
cost_basis numeric(14,2), portfolio_status text, inception_date date, created_by uuid, created_at
timestamptz, updated_at timestamptz.
Relationships: belongs to clients; parent of accounts and portfolio_snapshots; referenced by
transactions, tasks, documents.
Purpose: advisory portfolio containers.

#### accounts

Fields: id uuid PK, organization_id uuid, portfolio_id uuid, client_id uuid, account_number_mask
text, account_type text, custodian text, status text, created_at timestamptz, updated_at
timestamptz.
Relationships: belongs to portfolios, clients, organizations; referenced by transactions.
Purpose: account-level records under portfolios.

#### securities

Fields: id uuid PK, organization_id uuid, symbol text, name text, asset_class text, exchange text,
isin text, currency text, created_at timestamptz, updated_at timestamptz.
Relationships: referenced by transactions; unique on (organization_id, symbol).
Purpose: instrument/security master.

#### portfolio_snapshots

Fields: id uuid PK, organization_id uuid, portfolio_id uuid, snapshot_date date, market_value
numeric(14,2), cash_balance numeric(14,2), cost_basis numeric(14,2), gain_loss numeric(14,2),
gain_loss_percent numeric(8,2), created_at timestamptz, updated_at timestamptz.
Relationships: belongs to portfolios; unique on (portfolio_id, snapshot_date).
Purpose: periodic portfolio valuation history.

#### transactions

Fields: id uuid PK, organization_id uuid, portfolio_id uuid, account_id uuid, client_id uuid,
security_id uuid, transaction_type text, trade_date date, settlement_date date, security_symbol
text, description text, quantity numeric(16,4), price numeric(14,4), gross_amount numeric(14,2),
fees numeric(14,2), net_amount numeric(14,2), currency text, external_reference text, created_by
uuid, created_at timestamptz, updated_at timestamptz.
Relationships: belongs to portfolios; optionally references accounts, clients, securities.
Purpose: investment and cash movement ledger.

### Operations tables

#### tasks

Fields: id uuid PK, organization_id uuid, client_id uuid, portfolio_id uuid, title text,
description text, task_type text, priority text, status text, assigned_to uuid, created_by uuid,
due_at timestamptz, completed_at timestamptz, created_at timestamptz, updated_at timestamptz.
Relationships: optionally linked to clients, portfolios, profiles.
Purpose: advisor operational work queue.

#### meetings

Fields: id uuid PK, organization_id uuid, client_id uuid, advisor_id uuid, title text,
meeting_type text, channel text, location text, notes text, starts_at timestamptz, ends_at
timestamptz, status text, created_by uuid, created_at timestamptz, updated_at timestamptz.
Relationships: optionally linked to clients and profiles.
Purpose: client review / planning meeting records.

#### goals

Fields: id uuid PK, organization_id uuid, client_id uuid, name text, category text, target_amount
numeric(14,2), progress_amount numeric(14,2), target_date date, status text, notes text,
created_by uuid, created_at timestamptz, updated_at timestamptz.
Relationships: belongs to clients, organizations, profiles.
Purpose: financial goal tracking.

#### notifications

Fields: id uuid PK, organization_id uuid, user_id uuid, title text, body text, notification_type
text, is_read boolean, metadata jsonb, created_at timestamptz, updated_at timestamptz.
Relationships: belongs to organizations and profiles.
Purpose: user-scoped reminders/alerts.

### Documents and compliance tables

#### documents

Fields: id uuid PK, organization_id uuid, client_id uuid, portfolio_id uuid, uploaded_by uuid,
name text, bucket_name text, storage_path text, file_name text, mime_type text, size_bytes bigint,
document_category text, is_private boolean, uploaded_at timestamptz, created_at timestamptz,
updated_at timestamptz.
Relationships: optionally linked to clients, portfolios, profiles; referenced by
compliance_records.
Purpose: file metadata for Supabase Storage objects.

#### compliance_records

Fields: id uuid PK, organization_id uuid, client_id uuid, related_document_id uuid, record_type
text, status text, due_at timestamptz, completed_at timestamptz, notes text, created_by uuid,
created_at timestamptz, updated_at timestamptz.
Relationships: optionally linked to clients, documents, profiles.
Purpose: compliance/KYC/disclosure tracking.

#### audit_logs

Fields: id uuid PK, organization_id uuid, actor_id uuid, entity_type text, entity_id uuid, action
text, payload jsonb, created_at timestamptz.
Relationships: belongs to organizations; optionally linked to profiles; no updated_at.
Purpose: immutable action trail.

### Views

#### advisor_dashboard_metrics_v

Fields: organization_id, total_clients, active_clients, total_aum, open_tasks, upcoming_meetings.
Purpose: organization-level dashboard rollup from clients, portfolios, tasks, and meetings.
Used by: dashboard page.

#### client_aum_summary_v

Fields: client_id, organization_id, household_name, client_status, total_aum.
Purpose: per-client AUM rollup from clients and portfolios.
Used by: clients page.

#### monthly_net_flow_v

Fields: organization_id, month_start, net_flow.
Purpose: monthly transaction net flow reporting.
Used by: not referenced in current app code.

### Database functions and triggers

- public.set_updated_at()
Purpose: shared trigger function to maintain updated_at.
- public.is_org_member(uuid)
Purpose: RLS helper for organization membership checks.
- public.has_org_role(uuid, text[])
Purpose: RLS helper for role-based access checks.
- public.handle_new_user()
Purpose: auth trigger that inserts/updates a profiles row after auth.users creation.
- public.create_owner_membership_for_organization()
Purpose: trigger that creates owner membership when an organization is inserted.

### RLS and storage summary

- All major business tables have RLS enabled.
- Typical policy pattern:
    - members can select
    - owners/admins/advisors can usually insert and update
    - deletes are usually owner/admin only
- notifications are scoped to the owning user or admins.
- audit_logs are readable by owner, admin, compliance; insertable by owner, admin, advisor,
compliance.
- Storage bucket client-documents is private.
- Storage path policies require the first folder segment to match an organization UUID the user
belongs to.

## 7. Authentication System

- Auth provider: Supabase Auth email/password.
- Login flow: src/components/forms/login-form.tsx submits to authenticateAction.
- login intent: attempts supabase.auth.signInWithPassword; on success redirects to /dashboard or
safe next.
- create-demo intent: tries sign-in first; if credentials are invalid, creates a user via signUp;
if a session exists it redirects to /setup.
- Profile bootstrap: handle_new_user() trigger inserts/updates profiles from auth.users.
- Session handling: SSR clients from src/lib/supabase/server.ts, browser clients from src/lib/
supabase/browser.ts, and request-time route protection in src/proxy.ts.
- Route protection: unauthenticated requests to non-login routes are redirected to /login;
authenticated requests to /login are redirected to /dashboard.
- Role system: organization_memberships.role with values owner, admin, advisor, associate,
compliance; status values invited, active, inactive.
- Workspace bootstrap after auth: if a user has no active membership/organization,
requireViewerWorkspace() redirects them to /setup.

Key references: src/lib/auth/actions.ts, src/proxy.ts, supabase/
migrations/20260314171000_wealthflow_auth_bootstrap.sql

## 8. API / Server Actions

### Auth and mutation server actions

| Function | Inputs | Returns / behavior | Main DB/Auth operations |
| --- | --- | --- | --- |
| authenticateAction | FormData with email, password, intent, next | returns { message?: string }
on validation/auth error; otherwise redirects | auth.signInWithPassword, auth.signUp |
| signOutAction | none | signs out and redirects to /login | auth.signOut |
| provisionDemoWorkspaceAction | none; form POST from /setup | uploads seed data, revalidates
routes, redirects to /dashboard | upserts many tables, uploads storage objects |

### Route Handler

| Route | Inputs | Returns | Main operations |
| --- | --- | --- | --- |
| GET /api/documents/[id]/download | dynamic route param id | 302 redirect to signed storage URL,
or JSON 404/500 | checks workspace org, reads documents, calls storage.createSignedUrl |

### Server-side query functions

| Function | Inputs | Returned data | Main tables/views read |
| --- | --- | --- | --- |
| getSupabaseServerClient() | none | configured server Supabase client or throws | env-backed SSR
client creation |
| getViewerWorkspace() | none | current user, profile, active membership, organization | auth,
profiles, organization_memberships, organizations |
| requireViewerWorkspace() | none | active workspace or redirect to /setup | wrapper around
getViewerWorkspace() |
| getShellData() | none | viewer info + latest notifications | notifications, workspace tables |
| getDashboardData() | none | workspace, metrics, activities, tasks, chart |
advisor_dashboard_metrics_v, client_activities, tasks, portfolio_snapshots, clients |
| getClientsPageData() | none | client roster with total AUM and next meeting | clients,
client_aum_summary_v, meetings |
| getClientDetailData(clientId) | clientId: string | client record + portfolios + tasks +
documents + meetings | clients, portfolios, tasks, documents, meetings |
| getPortfoliosPageData() | none | portfolios, latest performance, transactions, chart |
portfolios, portfolio_snapshots, transactions, clients |
| getTasksPageData() | none | tasks plus lookup lists for clients and portfolios | tasks, clients,
portfolios |
| getDocumentsPageData() | none | documents with client names and upload dialog client list |
documents, clients |
| getMeetingsPageData() | none | meetings with client names | meetings, clients |

### Client-side live mutations

These are not server actions; they use the browser Supabase client directly and then call
router.refresh().

- ClientUpsertDialog
Inserts or updates clients.
- TaskWorkspace
Inserts tasks; updates task status and completed_at.
- DocumentUploadDialog
Uploads file to Supabase Storage, then inserts documents.

Key references: src/lib/wealthflow/server.ts, src/lib/wealthflow/actions.ts, src/app/api/
documents/[id]/download/route.ts

## 9. UI Component Library

### Checked-in shadcn/ui primitives in use

- Avatar
Used for client and advisor identity displays.
- Badge
Used for statuses, counts, labels, and small emphasis markers.
- Button
Primary action control across login, dialogs, and shell.
- Card
Primary surface/container component across almost every page.
- Dialog
Used for notifications, client upsert, task creation, and document upload.
- DropdownMenu
Used for theme menu and account menu.
- Form
Used by SettingsForm with React Hook Form.
- Input
Used in login, settings, search placeholders, dialogs.
- Label
Used in custom dialogs/forms.
- Select
Used in settings and mutation dialogs.
- Separator
Used inside sidebar primitives.
- Sheet
Used by the sidebar on mobile.
- Sidebar
Custom shadcn-style shell primitive; central to the app layout.
- Skeleton
Used in (app)/loading.tsx.
- Table
Used for clients, portfolios, tasks, meetings, documents, dashboard tables.
- Tabs
Used in client detail and analytics.
- Tooltip
Used in shell/sidebar interactions.

### Higher-level reusable components

- AppShell
Wraps all authenticated routes.
- AppSidebar
Builds nav from shared metadata in src/lib/navigation.ts.
- AppHeader
Sticky header with search input, notifications, theme, sign out.
- PageHeader
Standard route page heading component.
- MetricCard
Dashboard/analytics summary metric card.
- PortfolioPerformanceChart
Lightweight bar chart component using plain divs/CSS.
- LoginForm
Auth form wired to server action.
- SettingsForm
Validated settings form UI.
- ClientUpsertDialog
Live client create/edit modal.
- TaskWorkspace
Live task table + creation flow.
- DocumentUploadDialog
Live storage upload flow.

Key references: src/components/ui, src/components/shell, src/components/shared

## 10. Test Coverage

- Frameworks: Jest with next/jest + jsdom for component tests; Playwright for browser E2E.
- Jest setup: mocks ResizeObserver, PointerEvent, matchMedia, and pointer/scroll helpers in
jest.setup.ts.
- Shared test renderer: src/test/test-utils.tsx wraps components with theme, tooltip, and optional
sidebar providers.

### Component/Jest tests present

- dashboard-card.test.tsx
Tests MetricCard rendering and currency/non-currency display.
- header.test.tsx
Tests nested client route labeling and theme toggle menu in AppHeader.
- sidebar.test.tsx
Tests navigation links and active-state behavior for nested client routes.
- client-table.test.tsx
Renders the live clients page via mocked getClientsPageData() and tests dialog opening.

### Playwright E2E tests present

- auth.spec.ts
Bootstraps workspace, signs out, logs back in.
- dashboard.spec.ts
Verifies shell and dashboard render.
- clients.spec.ts
Verifies client roster and drill-down into client detail.
- portfolios.spec.ts
Verifies portfolio ledger page.
- tasks.spec.ts
Verifies task page and creating a new task from the live workspace.
- helpers.ts
Contains reusable login/bootstrap helpers.

### CI workflow present

- GitHub Actions workflow tests.yml runs:
    - npm ci
    - npm run lint
    - npm run test
    - npx playwright install --with-deps chromium firefox webkit
    - npm run test:e2e

### Areas not covered by checked-in tests

- No Jest or Playwright coverage for:
    - document upload/download flow
    - meetings page
    - analytics page
    - settings page
    - Route Handler error cases
    - server query helpers in isolation

Key references: src/test, e2e, .github/workflows/tests.yml

## 11. Seeded Data

### CLI seed script: npm run seed:wealthflow

Source: scripts/seed-wealthflow.mjs

- Creates or reuses demo advisor user:
    - email: vineeth.motati@wealthflow.in
    - password: WealthFlow123!
- Seeds one organization:
    - WealthFlow Advisory
- Seeds one owner membership for the advisor.
- Seeds risk profiles:
    - Conservative
    - Balanced
    - Growth
    - Aggressive
- Seeds 20 clients/households.
- Seeds 20 portfolios and 20 accounts.
- Seeds 10 securities.
- Seeds 6 monthly snapshot points per portfolio.
- Seeds 100 transactions.
- Seeds 15 tasks.
- Seeds 10 meetings.
- Seeds 20 goals.
- Seeds 12 document metadata rows.
- Seeds 18 notifications.
- Seeds 10 compliance records.
- Seeds 30 client activities.
- Seeds 20 audit logs.
- Uses deterministic SHA-256-derived UUIDs for repeatable upserts.

Important limitation: the CLI seed script inserts document metadata rows but does not upload
storage objects. Storage uploads happen in the in-app bootstrap action and the document upload
dialog, not in the CLI script.

### In-app bootstrap: /setup

Source: src/lib/wealthflow/actions.ts, src/lib/wealthflow/demo-data.ts

- Seeds the logged-in user’s own organization and profile.
- Relies on the organization insert trigger to create owner membership.
- Seeds:
    - organization
    - profile
    - risk profiles
    - clients
    - portfolios
    - accounts
    - securities
    - portfolio snapshots
    - transactions
    - tasks
    - meetings
    - goals
    - notifications
    - client activities
    - documents
- Uploads six text files into client-documents storage before inserting document rows.
- Does not insert compliance_records or audit_logs.

## 12. Environment Configuration

### Required by application runtime

| Variable | Used by | Required for |
| --- | --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | SSR/browser client helpers, proxy | all authenticated app routes,
login auth, live mutations |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | SSR/browser client helpers, proxy | all authenticated app
routes, login auth, live mutations |

### Required by CLI seed script

| Variable | Used by | Required for |
| --- | --- | --- |
| SUPABASE_URL | seed script | CLI seeding |
| SUPABASE_SECRET_KEY | seed script | CLI seeding |
| SUPABASE_SERVICE_ROLE_KEY | seed script fallback for secret key | CLI seeding |

### Present in local .env.local but not referenced by scanned app code

| Variable | Notes |
| --- | --- |
| SUPABASE_ACCESS_TOKEN | present in local env; not referenced in source files scanned |
| VERCEL_TOKEN | present in local env; not referenced in source files scanned |
| SUPABASE_PUBLIC_PUBLISHABLE_KEY | present in local env; current code uses
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY instead |

Important runtime note: despite older docs mentioning mock-backed UI, the current authenticated
shell and most product routes now require configured Supabase env vars because the shell reads
live workspace/session data on the server.

Key references: src/lib/supabase/config.ts, src/lib/supabase/server.ts, scripts/seed-
wealthflow.mjs

## 13. Deployment Setup

- next.config.ts is effectively empty; there is no custom Next.js build configuration.
- postcss.config.mjs only wires Tailwind’s PostCSS plugin.
- There is no checked-in vercel.json.
- There is no checked-in deployment workflow; the only GitHub Actions workflow is for validation/
testing.
- Build/start commands are standard:
    - npm run build
    - npm run start
- Local Playwright runs against npm run dev.
- CI Playwright runs against npm run build && npm run start.
- Because the app uses:
    - src/proxy.ts
    - SSR Supabase cookie sessions
    - server-side route data fetching
    - Route Handlers
    it requires a server-capable Next.js deployment, not static export.

Key references: next.config.ts, postcss.config.mjs, playwright.config.ts

## 14. Current System Capabilities

End to end, the application can currently do the following:

- authenticate a user with Supabase email/password
- auto-create a profiles row for new auth users
- redirect authenticated users into the workspace and unauthenticated users to login
- bootstrap a full demo tenant/workspace for a newly authenticated user
- render a responsive authenticated shell with navigation, notifications, search input shell,
theme switching, and sign-out
- show live dashboard metrics, activity, portfolio trend, and upcoming tasks
- show a live client roster with AUM and next-meeting rollups
- open a live client detail page with related portfolios, tasks, documents, and meetings
- create and edit client records
- show live portfolio ledger and transaction history
- create tasks and mark tasks complete
- show live meetings list
- upload documents to private Supabase Storage and persist document metadata
- generate signed document download links through a Route Handler
- run component tests and E2E tests through CI workflow definitions

## 15. Missing / Planned Features

These are gaps visible from the current codebase, not speculation:

- Analytics is still demo-only.
The page at /analytics reads from src/lib/mock-data.ts, not Supabase. Its chart component is
rendered without points.
- Settings are UI-only.
src/components/forms/settings-form.tsx validates inputs but has no submit handler, server
action, or persistence.
- Several schema-backed domains have no dedicated UI routes yet.
goals, compliance_records, audit_logs, risk_profiles, and organization membership/admin
management are present in SQL/seed data but not surfaced as first-class pages.
- Notifications are only partially surfaced.
Notifications appear in the header dialog, but there is no dedicated notifications page or read-
state mutation in UI.
- Search/filter controls are placeholders.
The header search input and client-page search/filter controls do not connect to query or filter
logic.
- Portfolio and meeting CRUD are not implemented in UI.
Current pages are read-only for these domains.
- Document management is partial.
Upload and download exist; delete/edit/categorization management flows do not.
- CLI seeding and in-app bootstrap are not equivalent.
CLI seed inserts compliance_records and audit_logs but does not upload storage objects; /setup
uploads storage objects but does not insert compliance_records or audit_logs.
- src/features/ is scaffolding only.
The directory exists but is unused.
- Repository docs are partially stale.
Docs still describe task creation as missing/skipped, but src/components/tasks/task-
workspace.tsx and e2e/tasks.spec.ts implement and test it.
- Type coverage is not fully complete.
src/types/database.ts covers most live tables and views, but does not include audit_logs.

## 16. Architecture Summary

Frontend

- Next.js App Router under src/app
- route groups (auth) and (app) organize pages without changing URL paths
- root layout provides theme and tooltip context
- authenticated layout mounts a shared shell

Server-side data layer

- server pages call query helpers in src/lib/wealthflow/server.ts
- helpers use the SSR Supabase client from src/lib/supabase/server.ts
- query helpers also enforce workspace presence and redirect to /login or /setup

Client-side mutation layer

- interactive dialogs/components marked with 'use client'
- they use the browser Supabase client from src/lib/supabase/browser.ts
- after mutations they call router.refresh() to re-render server data

Auth/session layer

- proxy.ts runs before render and protects routes using Supabase SSR cookie state
- authenticateAction and signOutAction handle auth mutations
- Supabase triggers keep profiles and owner memberships in sync

Database/storage layer

- Postgres schema is multi-tenant by organization_id
- RLS enforces tenant and role boundaries
- private storage bucket client-documents stores file objects
- a Route Handler creates signed document download URLs

Testing/CI layer

- Jest covers UI components and mocked page rendering
- Playwright covers login/bootstrap and major navigation flows
- GitHub Actions codifies lint + Jest + Playwright

## 17. Quick Start Guide

1. Install dependencies.
    npm install
2. Configure environment variables.
    Set at least:
    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
3. Apply Supabase migrations.
    Run the SQL in:
    supabase/migrations/20260314123000_wealthflow_core.sql
    supabase/migrations/20260314171000_wealthflow_auth_bootstrap.sql
4. Start the app.
    npm run dev
5. Open /login.
    Use the default demo credentials if the advisor user already exists, or click Create demo
    workspace to create/auth the user and provision a workspace.
6. Optional: run the full CLI seed instead of in-app bootstrap.
    Also set:
    SUPABASE_URL
    SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY
    Then run:
    npm run seed:wealthflow
7. Validation commands.
    npm run lint
    npm run test
    npm run test:e2e

## 18. AI Context Summary

- Product type: multi-tenant wealth-management CRM and advisor operations workspace.
- Architecture: Next.js 16 App Router frontend with shared shell, Supabase Auth + Postgres +
Storage backend, SSR session handling through proxy.ts, and a mix of server-rendered queries
plus client-side Supabase mutations.
- Key modules: src/lib/wealthflow/server.ts is the live read/query hub; src/lib/wealthflow/
actions.ts is the demo bootstrap mutation entrypoint; src/lib/auth/actions.ts handles auth; src/
components/shell/* defines the app chrome.
- Primary database entities: organizations, profiles, organization_memberships, clients,
client_activities, portfolios, accounts, securities, portfolio_snapshots, transactions, tasks,
meetings, goals, documents, notifications, compliance_records, audit_logs.
- Current live capabilities: login, workspace bootstrap, dashboard, client roster/detail, client
create/edit, portfolio ledger, task create/complete, meetings list, document upload/download,
notifications in header, sign out.
- Current demo-only capabilities: analytics page and settings page are UI/demo surfaces, not fully
wired to live backend state.
- Important caveat: repo docs still describe the app as mostly mock-backed, but the current
authenticated shell and most main routes are already live Supabase-backed and require Supabase
configuration to function end to end.
