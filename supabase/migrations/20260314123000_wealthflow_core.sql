create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text not null default 'Asia/Kolkata',
  base_currency text not null default 'INR',
  country_code text not null default 'IN',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.organizations is 'Tenant organizations for wealth advisory firms.';

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  avatar_url text,
  phone text,
  job_title text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.profiles is 'Application profile for authenticated users.';

create table if not exists public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'advisor', 'associate', 'compliance')),
  status text not null default 'active' check (status in ('invited', 'active', 'inactive')),
  joined_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, user_id)
);

comment on table public.organization_memberships is 'Links users to organizations with role and status.';

create table if not exists public.risk_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  score_min integer not null check (score_min >= 0),
  score_max integer not null check (score_max >= score_min),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  primary_advisor_id uuid references public.profiles(id),
  household_name text not null,
  first_name text,
  last_name text,
  email text,
  phone text,
  date_of_birth date,
  city text,
  client_status text not null default 'active' check (client_status in ('active', 'prospect', 'onboarding', 'inactive')),
  risk_profile text,
  source text,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.clients is 'CRM household and client records.';

create table if not exists public.client_activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  activity_type text not null,
  title text not null,
  description text,
  occurred_at timestamptz not null default timezone('utc', now()),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  advisor_id uuid references public.profiles(id),
  name text not null,
  account_type text not null,
  custodian text,
  account_mask text,
  base_currency text not null default 'INR',
  market_value numeric(14,2) not null default 0,
  cost_basis numeric(14,2) not null default 0,
  portfolio_status text not null default 'active' check (portfolio_status in ('active', 'pending', 'closed')),
  inception_date date,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.portfolios is 'Advisory portfolios at the household or account level.';

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  account_number_mask text not null,
  account_type text not null,
  custodian text,
  status text not null default 'active' check (status in ('active', 'dormant', 'closed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.securities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  symbol text not null,
  name text not null,
  asset_class text not null,
  exchange text,
  isin text,
  currency text not null default 'INR',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, symbol)
);

create table if not exists public.portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  snapshot_date date not null,
  market_value numeric(14,2) not null,
  cash_balance numeric(14,2) not null default 0,
  cost_basis numeric(14,2) not null default 0,
  gain_loss numeric(14,2) not null default 0,
  gain_loss_percent numeric(8,2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (portfolio_id, snapshot_date)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  security_id uuid references public.securities(id) on delete set null,
  transaction_type text not null,
  trade_date date not null,
  settlement_date date,
  security_symbol text,
  description text,
  quantity numeric(16,4),
  price numeric(14,4),
  gross_amount numeric(14,2) not null default 0,
  fees numeric(14,2) not null default 0,
  net_amount numeric(14,2) not null default 0,
  currency text not null default 'INR',
  external_reference text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.transactions is 'Investment and cash movement history across portfolios.';

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  portfolio_id uuid references public.portfolios(id) on delete set null,
  title text not null,
  description text,
  task_type text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'blocked', 'done')),
  assigned_to uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  advisor_id uuid references public.profiles(id),
  title text not null,
  meeting_type text not null,
  channel text not null check (channel in ('in_person', 'video', 'phone')),
  location text,
  notes text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  category text not null,
  target_amount numeric(14,2) not null default 0,
  progress_amount numeric(14,2) not null default 0,
  target_date date,
  status text not null default 'on_track' check (status in ('on_track', 'at_risk', 'completed')),
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  portfolio_id uuid references public.portfolios(id) on delete set null,
  uploaded_by uuid references public.profiles(id),
  name text not null,
  bucket_name text not null default 'client-documents',
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint not null default 0,
  document_category text not null,
  is_private boolean not null default true,
  uploaded_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  notification_type text not null,
  is_read boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.compliance_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  related_document_id uuid references public.documents(id) on delete set null,
  record_type text not null,
  status text not null default 'compliant' check (status in ('compliant', 'attention', 'expired')),
  due_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_memberships_user_org on public.organization_memberships(user_id, organization_id);
create index if not exists idx_risk_profiles_org on public.risk_profiles(organization_id);
create index if not exists idx_clients_org on public.clients(organization_id);
create index if not exists idx_clients_primary_advisor on public.clients(primary_advisor_id);
create index if not exists idx_client_activities_org on public.client_activities(organization_id);
create index if not exists idx_client_activities_client on public.client_activities(client_id, occurred_at desc);
create index if not exists idx_portfolios_org on public.portfolios(organization_id);
create index if not exists idx_portfolios_client on public.portfolios(client_id);
create index if not exists idx_accounts_org on public.accounts(organization_id);
create index if not exists idx_accounts_portfolio on public.accounts(portfolio_id);
create index if not exists idx_securities_org_symbol on public.securities(organization_id, symbol);
create index if not exists idx_snapshots_org on public.portfolio_snapshots(organization_id);
create index if not exists idx_transactions_org on public.transactions(organization_id);
create index if not exists idx_transactions_portfolio_date on public.transactions(portfolio_id, trade_date desc);
create index if not exists idx_tasks_org on public.tasks(organization_id);
create index if not exists idx_tasks_assigned_due on public.tasks(assigned_to, due_at);
create index if not exists idx_meetings_org on public.meetings(organization_id);
create index if not exists idx_meetings_client_start on public.meetings(client_id, starts_at);
create index if not exists idx_goals_org on public.goals(organization_id);
create index if not exists idx_documents_org on public.documents(organization_id);
create index if not exists idx_notifications_user on public.notifications(user_id, created_at desc);
create index if not exists idx_compliance_org on public.compliance_records(organization_id);
create index if not exists idx_audit_logs_org on public.audit_logs(organization_id, created_at desc);

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger memberships_set_updated_at
before update on public.organization_memberships
for each row execute function public.set_updated_at();

create trigger risk_profiles_set_updated_at
before update on public.risk_profiles
for each row execute function public.set_updated_at();

create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

create trigger client_activities_set_updated_at
before update on public.client_activities
for each row execute function public.set_updated_at();

create trigger portfolios_set_updated_at
before update on public.portfolios
for each row execute function public.set_updated_at();

create trigger accounts_set_updated_at
before update on public.accounts
for each row execute function public.set_updated_at();

create trigger securities_set_updated_at
before update on public.securities
for each row execute function public.set_updated_at();

create trigger snapshots_set_updated_at
before update on public.portfolio_snapshots
for each row execute function public.set_updated_at();

create trigger transactions_set_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

create trigger meetings_set_updated_at
before update on public.meetings
for each row execute function public.set_updated_at();

create trigger goals_set_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

create trigger documents_set_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

create trigger notifications_set_updated_at
before update on public.notifications
for each row execute function public.set_updated_at();

create trigger compliance_set_updated_at
before update on public.compliance_records
for each row execute function public.set_updated_at();

create or replace function public.is_org_member(p_organization_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = p_organization_id
      and membership.user_id = (select auth.uid())
      and membership.status = 'active'
  );
$$;

revoke all on function public.is_org_member(uuid) from public;
grant execute on function public.is_org_member(uuid) to authenticated;

create or replace function public.has_org_role(p_organization_id uuid, p_roles text[])
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = p_organization_id
      and membership.user_id = (select auth.uid())
      and membership.status = 'active'
      and membership.role = any(p_roles)
  );
$$;

revoke all on function public.has_org_role(uuid, text[]) from public;
grant execute on function public.has_org_role(uuid, text[]) to authenticated;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.risk_profiles enable row level security;
alter table public.clients enable row level security;
alter table public.client_activities enable row level security;
alter table public.portfolios enable row level security;
alter table public.accounts enable row level security;
alter table public.securities enable row level security;
alter table public.portfolio_snapshots enable row level security;
alter table public.transactions enable row level security;
alter table public.tasks enable row level security;
alter table public.meetings enable row level security;
alter table public.goals enable row level security;
alter table public.documents enable row level security;
alter table public.notifications enable row level security;
alter table public.compliance_records enable row level security;
alter table public.audit_logs enable row level security;

create policy "Authenticated users view own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Authenticated users create own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Authenticated users update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Members view organizations"
on public.organizations
for select
to authenticated
using ((select public.is_org_member(id)));

create policy "Authenticated users create organizations"
on public.organizations
for insert
to authenticated
with check ((select auth.uid()) = created_by);

create policy "Admins update organizations"
on public.organizations
for update
to authenticated
using ((select public.has_org_role(id, array['owner', 'admin']::text[])))
with check ((select public.has_org_role(id, array['owner', 'admin']::text[])));

create policy "Members view memberships"
on public.organization_memberships
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Admins create memberships"
on public.organization_memberships
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Admins update memberships"
on public.organization_memberships
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Owners delete memberships"
on public.organization_memberships
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner']::text[])));

create policy "Members view risk profiles"
on public.risk_profiles
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Advisors create risk profiles"
on public.risk_profiles
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Advisors update risk profiles"
on public.risk_profiles
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Admins delete risk profiles"
on public.risk_profiles
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Members view clients"
on public.clients
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Advisors create clients"
on public.clients
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Advisors update clients"
on public.clients
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Admins delete clients"
on public.clients
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Members view client activities"
on public.client_activities
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Advisors create client activities"
on public.client_activities
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Advisors update client activities"
on public.client_activities
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Admins delete client activities"
on public.client_activities
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Members view portfolios"
on public.portfolios
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Advisors create portfolios"
on public.portfolios
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Advisors update portfolios"
on public.portfolios
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Admins delete portfolios"
on public.portfolios
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Members view accounts"
on public.accounts
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Advisors create accounts"
on public.accounts
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Advisors update accounts"
on public.accounts
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Admins delete accounts"
on public.accounts
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Members view securities"
on public.securities
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Advisors create securities"
on public.securities
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Advisors update securities"
on public.securities
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Admins delete securities"
on public.securities
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Members view portfolio snapshots"
on public.portfolio_snapshots
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Advisors create portfolio snapshots"
on public.portfolio_snapshots
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Advisors update portfolio snapshots"
on public.portfolio_snapshots
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Admins delete portfolio snapshots"
on public.portfolio_snapshots
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Members view transactions"
on public.transactions
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Advisors create transactions"
on public.transactions
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Advisors update transactions"
on public.transactions
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Admins delete transactions"
on public.transactions
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Members view tasks"
on public.tasks
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Advisors create tasks"
on public.tasks
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Advisors update tasks"
on public.tasks
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Admins delete tasks"
on public.tasks
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Members view meetings"
on public.meetings
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Advisors create meetings"
on public.meetings
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Advisors update meetings"
on public.meetings
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Admins delete meetings"
on public.meetings
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Members view goals"
on public.goals
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Advisors create goals"
on public.goals
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Advisors update goals"
on public.goals
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Admins delete goals"
on public.goals
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Members view documents"
on public.documents
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Advisors create documents"
on public.documents
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Advisors update documents"
on public.documents
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Admins delete documents"
on public.documents
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Users view own notifications"
on public.notifications
for select
to authenticated
using ((select auth.uid()) = user_id and (select public.is_org_member(organization_id)));

create policy "Advisors create notifications"
on public.notifications
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor']::text[])));

create policy "Users update own notifications"
on public.notifications
for update
to authenticated
using (((select auth.uid()) = user_id) or (select public.has_org_role(organization_id, array['owner', 'admin']::text[])))
with check (((select auth.uid()) = user_id) or (select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Users delete own notifications"
on public.notifications
for delete
to authenticated
using (((select auth.uid()) = user_id) or (select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Members view compliance records"
on public.compliance_records
for select
to authenticated
using ((select public.is_org_member(organization_id)));

create policy "Advisors create compliance records"
on public.compliance_records
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor', 'compliance']::text[])));

create policy "Advisors update compliance records"
on public.compliance_records
for update
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor', 'compliance']::text[])))
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor', 'compliance']::text[])));

create policy "Admins delete compliance records"
on public.compliance_records
for delete
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin']::text[])));

create policy "Members view audit logs"
on public.audit_logs
for select
to authenticated
using ((select public.has_org_role(organization_id, array['owner', 'admin', 'compliance']::text[])));

create policy "Advisors create audit logs"
on public.audit_logs
for insert
to authenticated
with check ((select public.has_org_role(organization_id, array['owner', 'admin', 'advisor', 'compliance']::text[])));

create or replace view public.advisor_dashboard_metrics_v
with (security_invoker = true)
as
select
  organization_id,
  count(distinct client_id) as total_clients,
  count(distinct client_id) filter (where client_status = 'active') as active_clients,
  coalesce(sum(current_value), 0)::numeric(14,2) as total_aum,
  coalesce(sum(open_tasks), 0)::bigint as open_tasks,
  coalesce(sum(upcoming_meetings), 0)::bigint as upcoming_meetings
from (
  select
    organization_id,
    id as client_id,
    client_status,
    0::numeric as current_value,
    0::bigint as open_tasks,
    0::bigint as upcoming_meetings
  from public.clients
  union all
  select
    organization_id,
    null::uuid as client_id,
    null::text as client_status,
    market_value as current_value,
    0::bigint as open_tasks,
    0::bigint as upcoming_meetings
  from public.portfolios
  union all
  select
    organization_id,
    null::uuid as client_id,
    null::text as client_status,
    0::numeric as current_value,
    case when status in ('open', 'in_progress', 'blocked') then 1 else 0 end::bigint as open_tasks,
    0::bigint as upcoming_meetings
  from public.tasks
  union all
  select
    organization_id,
    null::uuid as client_id,
    null::text as client_status,
    0::numeric as current_value,
    0::bigint as open_tasks,
    case when starts_at >= timezone('utc', now()) then 1 else 0 end::bigint as upcoming_meetings
  from public.meetings
) metrics
group by organization_id;

create or replace view public.client_aum_summary_v
with (security_invoker = true)
as
select
  client.id as client_id,
  client.organization_id,
  client.household_name,
  client.client_status,
  coalesce(sum(portfolio.market_value), 0)::numeric(14,2) as total_aum
from public.clients client
left join public.portfolios portfolio
  on portfolio.client_id = client.id
group by client.id, client.organization_id, client.household_name, client.client_status;

create or replace view public.monthly_net_flow_v
with (security_invoker = true)
as
select
  organization_id,
  date_trunc('month', trade_date)::date as month_start,
  sum(net_amount)::numeric(14,2) as net_flow
from public.transactions
group by organization_id, date_trunc('month', trade_date)
order by month_start desc;

insert into storage.buckets (id, name, public)
values ('client-documents', 'client-documents', false)
on conflict (id) do nothing;

create policy "Members view storage objects for their organizations"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'client-documents'
  and ((storage.foldername(name))[1] in (
    select membership.organization_id::text
    from public.organization_memberships membership
    where membership.user_id = (select auth.uid())
      and membership.status = 'active'
  ))
);

create policy "Advisors upload storage objects for their organizations"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'client-documents'
  and ((storage.foldername(name))[1] in (
    select membership.organization_id::text
    from public.organization_memberships membership
    where membership.user_id = (select auth.uid())
      and membership.status = 'active'
      and membership.role in ('owner', 'admin', 'advisor', 'compliance')
  ))
);

create policy "Advisors update storage objects for their organizations"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'client-documents'
  and ((storage.foldername(name))[1] in (
    select membership.organization_id::text
    from public.organization_memberships membership
    where membership.user_id = (select auth.uid())
      and membership.status = 'active'
      and membership.role in ('owner', 'admin', 'advisor', 'compliance')
  ))
)
with check (
  bucket_id = 'client-documents'
  and ((storage.foldername(name))[1] in (
    select membership.organization_id::text
    from public.organization_memberships membership
    where membership.user_id = (select auth.uid())
      and membership.status = 'active'
      and membership.role in ('owner', 'admin', 'advisor', 'compliance')
  ))
);

create policy "Admins delete storage objects for their organizations"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'client-documents'
  and ((storage.foldername(name))[1] in (
    select membership.organization_id::text
    from public.organization_memberships membership
    where membership.user_id = (select auth.uid())
      and membership.status = 'active'
      and membership.role in ('owner', 'admin')
  ))
);
