# Database

## Current State

The authoritative backend model lives in [`supabase/migrations/20260314123000_wealthflow_core.sql`](../supabase/migrations/20260314123000_wealthflow_core.sql). The frontend currently does not read this data in route pages yet; it still renders mostly from [`src/lib/mock-data.ts`](../src/lib/mock-data.ts). The seed script in [`scripts/seed-wealthflow.mjs`](../scripts/seed-wealthflow.mjs) mirrors the schema closely and is the best executable reference for expected record shapes.

## Multi-Tenant Design

The database is organized around organizations:

- `organizations`: tenant root record
- `profiles`: app user profile tied to `auth.users`
- `organization_memberships`: user-to-tenant link with role and status

Every business-domain table carries an `organization_id`, which is the main tenancy boundary. This is enforced consistently across CRM, portfolio, operations, compliance, and audit tables.

Role model in `organization_memberships`:

- `owner`
- `admin`
- `advisor`
- `associate`
- `compliance`

Helper functions used by RLS:

- `public.is_org_member(organization_id)`
- `public.has_org_role(organization_id, roles[])`

## Table Groups and Purpose

### Identity and Tenant Tables

- `organizations`: firm-level tenant settings such as slug, timezone, base currency, and country
- `profiles`: user profile metadata
- `organization_memberships`: roles and active/invited membership state
- `risk_profiles`: tenant-specific suitability bands

### CRM and Relationship Tables

- `clients`: household and contact records
- `client_activities`: timeline and notes feed against a client

### Portfolio and Market Data Tables

- `portfolios`: advisory portfolio/account containers
- `accounts`: account-level records under portfolios
- `securities`: instrument master
- `portfolio_snapshots`: periodic valuation history
- `transactions`: trade and cash movement ledger

### Operations and Service Tables

- `tasks`: advisor work queue
- `meetings`: scheduled service and planning interactions
- `goals`: financial goals and progress tracking
- `notifications`: user-scoped reminders and alerts

### Documents and Compliance Tables

- `documents`: metadata for Supabase Storage files
- `compliance_records`: KYC, disclosures, acknowledgements, and related due dates
- `audit_logs`: entity-level action trail

## Core Relationships

- one `organization` has many memberships, clients, portfolios, tasks, meetings, documents, and audit records
- one `profile` can belong to many organizations through `organization_memberships`
- one `client` belongs to one organization and can have many portfolios, tasks, meetings, goals, activities, documents, and compliance records
- one `portfolio` belongs to one client and can have many accounts, snapshots, transactions, documents, and tasks
- one `document` can optionally back a `compliance_record`

The schema generally uses `on delete cascade` for tenant-owned children and `on delete set null` when preserving history is more important than referential strictness.

## Row-Level Security Model

RLS is enabled on all business tables plus storage access.

Broad policy pattern:

- `select`: members of the organization can read
- `insert` / `update`: owners, admins, and advisors usually write
- `delete`: typically restricted to owners or admins
- notifications are scoped to the owning user
- storage access is restricted by both bucket and the organization ID encoded in the object path

This produces a clean tenant boundary without having to duplicate role logic inside every application query.

## Views

The migration defines three reporting views:

- `advisor_dashboard_metrics_v`: counts clients, AUM, open tasks, and upcoming meetings per organization
- `client_aum_summary_v`: rolls up portfolio market value per client
- `monthly_net_flow_v`: summarizes transaction net flow by month

These are the intended bridge between operational tables and dashboard/reporting screens.

## Storage Design

The migration creates a private bucket:

- `client-documents`

Document rows store:

- `bucket_name`
- `storage_path`
- `file_name`
- MIME type and size metadata
- privacy flag

Storage policies check the first folder segment of the object path and require it to match an organization the user belongs to. In practice, paths are expected to start with the organization UUID.

## Seeding Model

[`scripts/seed-wealthflow.mjs`](../scripts/seed-wealthflow.mjs) creates:

- one organization
- one advisor profile and owner membership
- risk profiles
- 20 clients
- 20 portfolios and 20 accounts
- securities, snapshots, and 100 transactions
- tasks, meetings, goals, documents, notifications, compliance records, activities, and audit logs

The script uses deterministic UUIDs derived from hashes so repeated runs upsert predictably.

## TypeScript Schema Caveat

[`src/types/database.ts`](../src/types/database.ts) is not a full reflection of the SQL migration. It includes a useful subset for current Supabase helpers, but it omits several tables already present in SQL, including `risk_profiles`, `client_activities`, `accounts`, `securities`, `portfolio_snapshots`, and `audit_logs`.

If you wire live data into more routes, expand or regenerate the TypeScript types before relying on compile-time coverage.
