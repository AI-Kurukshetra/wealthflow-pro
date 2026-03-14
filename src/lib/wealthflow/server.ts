import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type ViewerProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  job_title: string | null;
};

type ViewerOrganization = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  base_currency: string;
  country_code: string;
};

type ViewerNotification = {
  id: string;
  title: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
};

type ViewerMembership = {
  organization_id: string;
  role: string;
  status: string;
};

type DashboardActivityRow = {
  id: string;
  title: string;
  occurred_at: string;
  client_id: string | null;
};

type DashboardTaskRow = {
  id: string;
  title: string;
  priority: string;
  status: string;
  due_at: string | null;
  client_id: string | null;
};

type DashboardMetricsRow = {
  organization_id: string | null;
  total_clients: number | null;
  active_clients: number | null;
  total_aum: number | null;
  open_tasks: number | null;
  upcoming_meetings: number | null;
};

type SnapshotChartRow = {
  snapshot_date: string;
  market_value: number;
};

type ClientLookupRow = {
  id: string;
  household_name: string;
};

type ClientListRow = {
  id: string;
  household_name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  client_status: string;
  risk_profile: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
};

type ClientAumRow = {
  client_id: string | null;
  total_aum: number | null;
};

type MeetingLookupRow = {
  client_id: string | null;
  starts_at: string;
};

type ClientDetailPortfolioRow = {
  id: string;
  name: string;
  account_type: string;
  custodian: string | null;
  market_value: number;
  cost_basis: number;
  portfolio_status: string;
  inception_date: string | null;
};

type ClientDetailTaskRow = {
  id: string;
  title: string;
  priority: string;
  status: string;
  due_at: string | null;
  task_type: string;
};

type ClientDetailDocumentRow = {
  id: string;
  name: string;
  file_name: string;
  document_category: string;
  uploaded_at: string;
  bucket_name: string;
  storage_path: string;
};

type ClientDetailMeetingRow = {
  id: string;
  title: string;
  meeting_type: string;
  channel: string;
  location: string | null;
  starts_at: string;
  status: string;
};

type ClientDetailClientRow = {
  id: string;
  household_name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  client_status: string;
  risk_profile: string | null;
  notes: string | null;
  created_at: string;
};

type PortfolioPageRow = {
  id: string;
  client_id: string;
  name: string;
  account_type: string;
  custodian: string | null;
  market_value: number;
  cost_basis: number;
  portfolio_status: string;
};

type PortfolioSnapshotRow = {
  portfolio_id: string;
  snapshot_date: string;
  market_value: number;
  gain_loss_percent: number | null;
};

type TransactionPageRow = {
  id: string;
  portfolio_id: string;
  trade_date: string;
  transaction_type: string;
  security_symbol: string | null;
  net_amount: number;
};

type TaskPageRow = {
  id: string;
  title: string;
  description: string | null;
  task_type: string;
  priority: string;
  status: string;
  due_at: string | null;
  client_id: string | null;
  portfolio_id: string | null;
};

type PortfolioLookupRow = {
  id: string;
  name: string;
};

type DocumentPageRow = {
  id: string;
  client_id: string | null;
  name: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number;
  document_category: string;
  uploaded_at: string;
  storage_path: string;
  bucket_name: string;
};

type MeetingPageRow = {
  id: string;
  title: string;
  meeting_type: string;
  channel: string;
  location: string | null;
  starts_at: string;
  status: string;
  client_id: string | null;
};

export type ViewerWorkspace = {
  user: {
    id: string;
    email: string;
  };
  profile: ViewerProfile | null;
  organization: ViewerOrganization | null;
  membership: ViewerMembership | null;
};

export type ActiveViewerWorkspace = ViewerWorkspace & {
  organization: ViewerOrganization;
  membership: ViewerMembership;
};

const LOGIN_PATH = "/login";
const SETUP_PATH = "/setup";

export const getSupabaseServerClient = cache(async () => {
  const supabase = await createClient();

  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return supabase;
});

export const getViewerWorkspace = cache(async (): Promise<ViewerWorkspace> => {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect(LOGIN_PATH);
  }

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, phone, job_title")
      .eq("id", user.id)
      .maybeSingle<ViewerProfile>(),
    supabase
      .from("organization_memberships")
      .select("organization_id, role, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1),
  ]);

  const membership = ((memberships ?? []) as ViewerMembership[])[0] ?? null;

  if (!membership) {
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      profile,
      organization: null,
      membership: null,
    };
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("id, name, slug, timezone, base_currency, country_code")
    .eq("id", membership.organization_id)
    .maybeSingle<ViewerOrganization>();

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile,
    organization,
    membership,
  };
});

export async function requireViewerWorkspace(): Promise<ActiveViewerWorkspace> {
  const workspace = await getViewerWorkspace();

  if (!workspace.membership || !workspace.organization) {
    redirect(SETUP_PATH);
  }

  return workspace as ActiveViewerWorkspace;
}

export async function getShellData() {
  const workspace = await getViewerWorkspace();

  if (!workspace.membership) {
    return {
      viewer: {
        name: workspace.profile?.full_name ?? workspace.user.email,
        email: workspace.profile?.email ?? workspace.user.email,
        title: workspace.profile?.job_title ?? "Advisor",
        initials: getInitials(workspace.profile?.full_name ?? workspace.user.email),
        organizationName: "Workspace setup required",
        organizationLocation: "Create your demo workspace",
      },
      notifications: [] as ViewerNotification[],
    };
  }

  const supabase = await getSupabaseServerClient();
  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, notification_type, is_read, created_at")
    .eq("organization_id", workspace.membership.organization_id)
    .eq("user_id", workspace.user.id)
    .order("created_at", { ascending: false })
    .limit(6);

  return {
    viewer: {
      name: workspace.profile?.full_name ?? workspace.user.email,
      email: workspace.profile?.email ?? workspace.user.email,
      title: workspace.profile?.job_title ?? "Advisor",
      initials: getInitials(workspace.profile?.full_name ?? workspace.user.email),
      organizationName: workspace.organization?.name ?? "WealthFlow Advisory",
      organizationLocation: [
        workspace.organization?.country_code === "IN" ? "India" : null,
        workspace.organization?.timezone,
      ]
        .filter(Boolean)
        .join(" • "),
    },
    notifications: notifications ?? [],
  };
}

export async function getDashboardData() {
  const workspace = await requireViewerWorkspace();
  const supabase = await getSupabaseServerClient();
  const organizationId = workspace.membership.organization_id;

  const [metricsResult, activitiesResult, tasksResult, snapshotsResult] =
    await Promise.all([
      supabase
        .from("advisor_dashboard_metrics_v")
        .select(
          "organization_id, total_clients, active_clients, total_aum, open_tasks, upcoming_meetings"
        )
        .eq("organization_id", organizationId)
        .maybeSingle(),
      supabase
        .from("client_activities")
        .select("id, title, occurred_at, client_id")
        .eq("organization_id", organizationId)
        .order("occurred_at", { ascending: false })
        .limit(5),
      supabase
        .from("tasks")
        .select("id, title, priority, status, due_at, client_id")
        .eq("organization_id", organizationId)
        .order("due_at", { ascending: true })
        .limit(6),
      supabase
        .from("portfolio_snapshots")
        .select("snapshot_date, market_value")
        .eq("organization_id", organizationId)
        .order("snapshot_date", { ascending: true }),
    ]);

  const clientIds = Array.from(
    new Set([
      ...((activitiesResult.data ?? []) as DashboardActivityRow[])
        .map((activity) => activity.client_id)
        .filter(Boolean),
      ...((tasksResult.data ?? []) as DashboardTaskRow[])
        .map((task) => task.client_id)
        .filter(Boolean),
    ])
  );

  const clientsResult = clientIds.length
    ? await supabase
        .from("clients")
        .select("id, household_name")
        .in("id", clientIds)
    : { data: [] as ClientLookupRow[] };

  const clientNames = new Map(
    ((clientsResult.data ?? []) as ClientLookupRow[]).map((client) => [
      client.id,
      client.household_name,
    ])
  );

  const chartTotals = new Map<string, number>();
  const metrics = (metricsResult.data ?? null) as DashboardMetricsRow | null;

  for (const snapshot of (snapshotsResult.data ?? []) as SnapshotChartRow[]) {
    chartTotals.set(
      snapshot.snapshot_date,
      (chartTotals.get(snapshot.snapshot_date) ?? 0) + Number(snapshot.market_value)
    );
  }

  return {
    workspace,
    metrics,
    activities: ((activitiesResult.data ?? []) as DashboardActivityRow[]).map((activity) => ({
      id: activity.id,
      title: activity.title,
      occurredAt: activity.occurred_at,
      clientName: clientNames.get(activity.client_id ?? "") ?? "Household update",
    })),
    tasks: ((tasksResult.data ?? []) as DashboardTaskRow[]).map((task) => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      status: task.status,
      dueAt: task.due_at,
      clientName: clientNames.get(task.client_id ?? "") ?? "Unassigned household",
    })),
    chart: Array.from(chartTotals.entries()).map(([snapshotDate, total]) => ({
      label: new Intl.DateTimeFormat("en-IN", { month: "short" }).format(
        new Date(snapshotDate)
      ),
      value: total,
    })),
  };
}

export async function getClientsPageData() {
  const workspace = await requireViewerWorkspace();
  const supabase = await getSupabaseServerClient();
  const organizationId = workspace.membership.organization_id;

  const [clientsResult, aumResult, meetingsResult] = await Promise.all([
    supabase
      .from("clients")
      .select(
        "id, household_name, email, phone, city, client_status, risk_profile, first_name, last_name, created_at, updated_at"
      )
      .eq("organization_id", organizationId)
      .order("household_name"),
    supabase
      .from("client_aum_summary_v")
      .select("client_id, total_aum")
      .eq("organization_id", organizationId),
    supabase
      .from("meetings")
      .select("client_id, starts_at")
      .eq("organization_id", organizationId)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true }),
  ]);

  const aumByClient = new Map(
    ((aumResult.data ?? []) as ClientAumRow[]).map((entry) => [
      entry.client_id,
      Number(entry.total_aum ?? 0),
    ])
  );
  const nextMeetingByClient = new Map<string, string>();

  for (const meeting of (meetingsResult.data ?? []) as MeetingLookupRow[]) {
    if (meeting.client_id && !nextMeetingByClient.has(meeting.client_id)) {
      nextMeetingByClient.set(meeting.client_id, meeting.starts_at);
    }
  }

  return {
    workspace,
    clients:
      ((clientsResult.data ?? []) as ClientListRow[]).map((client) => ({
        ...client,
        totalAum: aumByClient.get(client.id) ?? 0,
        nextMeetingAt: nextMeetingByClient.get(client.id) ?? null,
      })),
  };
}

export async function getClientDetailData(clientId: string) {
  const workspace = await requireViewerWorkspace();
  const supabase = await getSupabaseServerClient();
  const organizationId = workspace.membership.organization_id;

  const clientResult = await supabase
    .from("clients")
    .select(
      "id, household_name, email, phone, city, client_status, risk_profile, notes, created_at"
    )
    .eq("organization_id", organizationId)
    .eq("id", clientId)
    .maybeSingle();

  if (!clientResult.data) {
    return null;
  }

  const [portfoliosResult, tasksResult, documentsResult, meetingsResult] =
    await Promise.all([
      supabase
        .from("portfolios")
        .select(
          "id, name, account_type, custodian, market_value, cost_basis, portfolio_status, inception_date"
        )
        .eq("organization_id", organizationId)
        .eq("client_id", clientId)
        .order("name"),
      supabase
        .from("tasks")
        .select("id, title, priority, status, due_at, task_type")
        .eq("organization_id", organizationId)
        .eq("client_id", clientId)
        .order("due_at", { ascending: true }),
      supabase
        .from("documents")
        .select(
          "id, name, file_name, document_category, uploaded_at, bucket_name, storage_path"
        )
        .eq("organization_id", organizationId)
        .eq("client_id", clientId)
        .order("uploaded_at", { ascending: false }),
      supabase
        .from("meetings")
        .select("id, title, meeting_type, channel, location, starts_at, status")
        .eq("organization_id", organizationId)
        .eq("client_id", clientId)
        .order("starts_at", { ascending: true }),
    ]);

  return {
    workspace,
    client: clientResult.data as ClientDetailClientRow,
    portfolios: (portfoliosResult.data ?? []) as ClientDetailPortfolioRow[],
    tasks: (tasksResult.data ?? []) as ClientDetailTaskRow[],
    documents: (documentsResult.data ?? []) as ClientDetailDocumentRow[],
    meetings: (meetingsResult.data ?? []) as ClientDetailMeetingRow[],
  };
}

export async function getPortfoliosPageData() {
  const workspace = await requireViewerWorkspace();
  const supabase = await getSupabaseServerClient();
  const organizationId = workspace.membership.organization_id;

  const [portfoliosResult, snapshotsResult, transactionsResult, clientsResult] =
    await Promise.all([
      supabase
        .from("portfolios")
        .select(
          "id, client_id, name, account_type, custodian, market_value, cost_basis, portfolio_status"
        )
        .eq("organization_id", organizationId)
        .order("name"),
      supabase
        .from("portfolio_snapshots")
        .select("portfolio_id, snapshot_date, market_value, gain_loss_percent")
        .eq("organization_id", organizationId)
        .order("snapshot_date", { ascending: true }),
      supabase
        .from("transactions")
        .select("id, portfolio_id, trade_date, transaction_type, security_symbol, net_amount")
        .eq("organization_id", organizationId)
        .order("trade_date", { ascending: false })
        .limit(12),
      supabase.from("clients").select("id, household_name").eq("organization_id", organizationId),
    ]);

  const clientNames = new Map(
    ((clientsResult.data ?? []) as ClientLookupRow[]).map((client) => [
      client.id,
      client.household_name,
    ])
  );
  const latestSnapshotByPortfolio = new Map<
    string,
    { snapshot_date: string; gain_loss_percent: number | null }
  >();
  const chartTotals = new Map<string, number>();

  for (const snapshot of (snapshotsResult.data ?? []) as PortfolioSnapshotRow[]) {
    chartTotals.set(
      snapshot.snapshot_date,
      (chartTotals.get(snapshot.snapshot_date) ?? 0) + Number(snapshot.market_value)
    );

    const existing = latestSnapshotByPortfolio.get(snapshot.portfolio_id);

    if (!existing || existing.snapshot_date < snapshot.snapshot_date) {
      latestSnapshotByPortfolio.set(snapshot.portfolio_id, {
        snapshot_date: snapshot.snapshot_date,
        gain_loss_percent: snapshot.gain_loss_percent,
      });
    }
  }

  return {
    workspace,
    portfolios:
      ((portfoliosResult.data ?? []) as PortfolioPageRow[]).map((portfolio) => ({
        ...portfolio,
        clientName: clientNames.get(portfolio.client_id) ?? "Unknown household",
        latestPerformance:
          latestSnapshotByPortfolio.get(portfolio.id)?.gain_loss_percent ?? null,
      })),
    transactions:
      ((transactionsResult.data ?? []) as TransactionPageRow[]).map((transaction) => ({
        ...transaction,
        net_amount: Number(transaction.net_amount),
      })),
    chart: Array.from(chartTotals.entries()).map(([snapshotDate, total]) => ({
      label: new Intl.DateTimeFormat("en-IN", { month: "short" }).format(
        new Date(snapshotDate)
      ),
      value: total,
    })),
  };
}

export async function getTasksPageData() {
  const workspace = await requireViewerWorkspace();
  const supabase = await getSupabaseServerClient();
  const organizationId = workspace.membership.organization_id;

  const [tasksResult, clientsResult, portfoliosResult] = await Promise.all([
    supabase
      .from("tasks")
      .select(
        "id, title, description, task_type, priority, status, due_at, client_id, portfolio_id"
      )
      .eq("organization_id", organizationId)
      .order("due_at", { ascending: true }),
    supabase.from("clients").select("id, household_name").eq("organization_id", organizationId),
    supabase.from("portfolios").select("id, name").eq("organization_id", organizationId),
  ]);

  const clientNames = new Map(
    ((clientsResult.data ?? []) as ClientLookupRow[]).map((client) => [
      client.id,
      client.household_name,
    ])
  );
  const portfolioNames = new Map(
    ((portfoliosResult.data ?? []) as PortfolioLookupRow[]).map((portfolio) => [
      portfolio.id,
      portfolio.name,
    ])
  );

  return {
    workspace,
    tasks:
      ((tasksResult.data ?? []) as TaskPageRow[]).map((task) => ({
        ...task,
        clientName: clientNames.get(task.client_id ?? "") ?? "General",
        portfolioName: portfolioNames.get(task.portfolio_id ?? "") ?? null,
      })),
    clients: (clientsResult.data ?? []) as ClientLookupRow[],
    portfolios: (portfoliosResult.data ?? []) as PortfolioLookupRow[],
  };
}

export async function getDocumentsPageData() {
  const workspace = await requireViewerWorkspace();
  const supabase = await getSupabaseServerClient();
  const organizationId = workspace.membership.organization_id;

  const [documentsResult, clientsResult] = await Promise.all([
    supabase
      .from("documents")
      .select(
        "id, client_id, name, file_name, mime_type, size_bytes, document_category, uploaded_at, storage_path, bucket_name"
      )
      .eq("organization_id", organizationId)
      .order("uploaded_at", { ascending: false }),
    supabase.from("clients").select("id, household_name").eq("organization_id", organizationId),
  ]);

  const clientNames = new Map(
    ((clientsResult.data ?? []) as ClientLookupRow[]).map((client) => [
      client.id,
      client.household_name,
    ])
  );

  return {
    workspace,
    organizationId,
    documents:
      ((documentsResult.data ?? []) as DocumentPageRow[]).map((document) => ({
        ...document,
        size_bytes: Number(document.size_bytes),
        clientName: clientNames.get(document.client_id ?? "") ?? "Firm-wide",
      })),
    clients: (clientsResult.data ?? []) as ClientLookupRow[],
  };
}

export async function getMeetingsPageData() {
  const workspace = await requireViewerWorkspace();
  const supabase = await getSupabaseServerClient();
  const organizationId = workspace.membership.organization_id;

  const [meetingsResult, clientsResult] = await Promise.all([
    supabase
      .from("meetings")
      .select("id, title, meeting_type, channel, location, starts_at, status, client_id")
      .eq("organization_id", organizationId)
      .order("starts_at", { ascending: true }),
    supabase.from("clients").select("id, household_name").eq("organization_id", organizationId),
  ]);

  const clientNames = new Map(
    ((clientsResult.data ?? []) as ClientLookupRow[]).map((client) => [
      client.id,
      client.household_name,
    ])
  );

  return {
    workspace,
    meetings:
      ((meetingsResult.data ?? []) as MeetingPageRow[]).map((meeting) => ({
        ...meeting,
        clientName: clientNames.get(meeting.client_id ?? "") ?? "Firm review",
      })),
  };
}

function getInitials(input: string) {
  return input
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
