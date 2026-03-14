import { createHash } from "node:crypto";

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY/SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const organizationId = stableUuid("wealthflow-organization");
const advisorEmail = "neha.bansal@wealthflow.in";

function stableUuid(seed) {
  const hex = createHash("sha256").update(seed).digest("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
    12,
    16
  )}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function chunk(array, size) {
  const output = [];

  for (let index = 0; index < array.length; index += size) {
    output.push(array.slice(index, index + size));
  }

  return output;
}

async function upsert(table, rows) {
  for (const batch of chunk(rows, 200)) {
    const { error } = await supabase.from(table).upsert(batch, {
      onConflict: "id",
      ignoreDuplicates: false,
    });

    if (error) {
      throw error;
    }
  }
}

async function getOrCreateAdvisorUser() {
  const createResult = await supabase.auth.admin.createUser({
    email: advisorEmail,
    password: "WealthFlow123!",
    email_confirm: true,
    user_metadata: {
      full_name: "Neha Bansal",
    },
  });

  if (!createResult.error && createResult.data.user) {
    return createResult.data.user.id;
  }

  const usersResult = await supabase.auth.admin.listUsers();
  if (usersResult.error) {
    throw usersResult.error;
  }

  const existingUser = usersResult.data.users.find(
    (user) => user.email === advisorEmail
  );

  if (!existingUser) {
    throw createResult.error;
  }

  return existingUser.id;
}

function buildClients(advisorId) {
  const names = [
    ["Aarav", "Shah", "Aarav & Meera Shah"],
    ["Rohan", "Malhotra", "Rohan Malhotra"],
    ["Nisha", "Kapoor", "Nisha Kapoor"],
    ["Dev", "Patel", "Dev Patel Family"],
    ["Sanjay", "Bedi", "Sanjay Bedi"],
    ["Ishita", "Rao", "Ishita Rao"],
    ["Kunal", "Deshpande", "Kunal Deshpande"],
    ["Priya", "Sethi", "Priya Sethi"],
    ["Ananya", "Ghosh", "Ananya Ghosh"],
    ["Arjun", "Nair", "Arjun Nair"],
    ["Mira", "Vora", "Mira Vora"],
    ["Kabir", "Khanna", "Kabir Khanna"],
    ["Tara", "Anand", "Tara Anand"],
    ["Neil", "Chawla", "Neil Chawla"],
    ["Diya", "Menon", "Diya Menon"],
    ["Vikram", "Joshi", "Vikram Joshi"],
    ["Leena", "Dutt", "Leena Dutt"],
    ["Rahul", "Tandon", "Rahul Tandon"],
    ["Aisha", "Mirza", "Aisha Mirza"],
    ["Yash", "Mehta", "Yash Mehta"],
  ];

  return names.map(([firstName, lastName, householdName], index) => ({
    id: stableUuid(`client-${index + 1}`),
    organization_id: organizationId,
    primary_advisor_id: advisorId,
    household_name: householdName,
    first_name: firstName,
    last_name: lastName,
    email: `${firstName}.${lastName}@example.com`.toLowerCase(),
    phone: `+91 98${String(10000000 + index * 2713).slice(0, 8)}`,
    date_of_birth: `19${74 + (index % 18)}-${String((index % 12) + 1).padStart(
      2,
      "0"
    )}-15`,
    city: ["Mumbai", "Bengaluru", "Delhi", "Pune", "Hyderabad"][index % 5],
    client_status:
      index % 5 === 0 ? "onboarding" : index % 7 === 0 ? "prospect" : "active",
    risk_profile: ["Conservative", "Balanced", "Growth", "Aggressive"][index % 4],
    source: ["Referral", "Existing client", "Seminar", "Website"][index % 4],
    notes: "Seeded from the WealthFlow blueprint for realistic CRM demo data.",
    created_by: advisorId,
  }));
}

function buildPortfolios(clients, advisorId) {
  return clients.map((client, index) => ({
    id: stableUuid(`portfolio-${index + 1}`),
    organization_id: organizationId,
    client_id: client.id,
    advisor_id: advisorId,
    name: `${client.first_name} Core Wealth`,
    account_type:
      index % 3 === 0
        ? "Advisory PMS"
        : index % 2 === 0
          ? "Mutual Fund Wrap"
          : "Discretionary",
    custodian: ["HDFC Securities", "ICICI Direct", "Axis Capital"][index % 3],
    account_mask: `XXXX${4100 + index}`,
    base_currency: "INR",
    market_value: 9500000 + index * 2150000,
    cost_basis: 8200000 + index * 1870000,
    portfolio_status: "active",
    inception_date: `2022-${String((index % 12) + 1).padStart(2, "0")}-01`,
    created_by: advisorId,
  }));
}

function buildAccounts(clients, portfolios) {
  return portfolios.map((portfolio, index) => ({
    id: stableUuid(`account-${index + 1}`),
    organization_id: organizationId,
    portfolio_id: portfolio.id,
    client_id: clients[index].id,
    account_number_mask: `XXXX-XX-${4401 + index}`,
    account_type: portfolio.account_type,
    custodian: portfolio.custodian,
    status: "active",
  }));
}

function buildSecurities() {
  return [
    ["HDFCFLEXI", "HDFC Flexi Cap Fund", "Mutual Fund"],
    ["NIFTYBEES", "Nippon Nifty 50 ETF", "ETF"],
    ["AXISSTB", "Axis Short Term Bond Fund", "Debt"],
    ["ICICBANK", "ICICI Bank", "Equity"],
    ["TCS", "Tata Consultancy Services", "Equity"],
    ["BHARATBND", "Bharat Bond ETF", "Debt"],
    ["SOVGOLD", "Sovereign Gold Bond", "Commodity"],
    ["RELIANCE", "Reliance Industries", "Equity"],
    ["HDFCBANK", "HDFC Bank", "Equity"],
    ["KOTAKEQ", "Kotak Emerging Equity", "Mutual Fund"],
  ].map(([symbol, name, assetClass], index) => ({
    id: stableUuid(`security-${index + 1}`),
    organization_id: organizationId,
    symbol,
    name,
    asset_class: assetClass,
    exchange: "NSE",
    isin: `INE${String(100000000 + index).slice(0, 9)}`,
    currency: "INR",
  }));
}

function buildTransactions(clients, portfolios, accounts, securities, advisorId) {
  return Array.from({ length: 100 }, (_, index) => {
    const portfolio = portfolios[index % portfolios.length];
    const account = accounts[index % accounts.length];
    const client = clients[index % clients.length];
    const security = securities[index % securities.length];
    const quantity = 15 + (index % 8) * 5;
    const price = 1200 + (index % 12) * 87;
    const gross = quantity * price;
    const fees = 185 + (index % 4) * 35;

    const tradeDay = String((index % 24) + 1).padStart(2, "0");
    const settlementDay = String((index % 24) + 3).padStart(2, "0");

    return {
      id: stableUuid(`transaction-${index + 1}`),
      organization_id: organizationId,
      portfolio_id: portfolio.id,
      account_id: account.id,
      client_id: client.id,
      security_id: security.id,
      transaction_type: ["buy", "sip", "rebalance", "dividend", "sell"][index % 5],
      trade_date: `2026-${String((index % 3) + 1).padStart(2, "0")}-${tradeDay}`,
      settlement_date: `2026-${String((index % 3) + 1).padStart(
        2,
        "0"
      )}-${settlementDay}`,
      security_symbol: security.symbol,
      description: `${security.name} seeded transaction`,
      quantity,
      price,
      gross_amount: gross,
      fees,
      net_amount:
        index % 5 === 3 ? Number((gross - fees).toFixed(2)) : Number((gross + fees).toFixed(2)),
      currency: "INR",
      external_reference: `WF-TXN-${String(index + 1).padStart(4, "0")}`,
      created_by: advisorId,
    };
  });
}

function buildSnapshots(portfolios) {
  const monthStarts = [
    "2025-10-31",
    "2025-11-30",
    "2025-12-31",
    "2026-01-31",
    "2026-02-28",
    "2026-03-31",
  ];

  return portfolios.flatMap((portfolio, index) =>
    monthStarts.map((snapshotDate, monthIndex) => {
      const marketValue = portfolio.market_value * (0.92 + monthIndex * 0.022);
      const costBasis = portfolio.cost_basis * (0.96 + monthIndex * 0.01);
      const gainLoss = marketValue - costBasis;

      return {
        id: stableUuid(`${portfolio.id}-${snapshotDate}`),
        organization_id: organizationId,
        portfolio_id: portfolio.id,
        snapshot_date: snapshotDate,
        market_value: Number(marketValue.toFixed(2)),
        cash_balance: 340000 + index * 25000,
        cost_basis: Number(costBasis.toFixed(2)),
        gain_loss: Number(gainLoss.toFixed(2)),
        gain_loss_percent: Number(((gainLoss / costBasis) * 100).toFixed(2)),
      };
    })
  );
}

function buildTasks(clients, portfolios, advisorId) {
  return Array.from({ length: 15 }, (_, index) => ({
    id: stableUuid(`task-${index + 1}`),
    organization_id: organizationId,
    client_id: clients[index % clients.length].id,
    portfolio_id: portfolios[index % portfolios.length].id,
    title: [
      "Prepare quarterly review deck",
      "Upload FATCA declaration",
      "Rebalance equity sleeve",
      "Send tax harvesting memo",
      "Confirm nominee details",
    ][index % 5],
    description: "Seeded operational task for WealthFlow advisor workflow coverage.",
    task_type: ["review", "compliance", "portfolio", "tax", "service"][index % 5],
    priority: ["high", "medium", "low"][index % 3],
    status: index % 4 === 0 ? "blocked" : index % 3 === 0 ? "in_progress" : "open",
    assigned_to: advisorId,
    created_by: advisorId,
    due_at: `2026-03-${String((index % 10) + 15).padStart(2, "0")}T09:00:00.000Z`,
  }));
}

function buildMeetings(clients, advisorId) {
  return Array.from({ length: 10 }, (_, index) => ({
    id: stableUuid(`meeting-${index + 1}`),
    organization_id: organizationId,
    client_id: clients[index * 2]?.id ?? clients[index].id,
    advisor_id: advisorId,
    title: [
      "Annual review",
      "Goal planning",
      "Risk calibration",
      "Estate planning",
      "Opportunity check-in",
    ][index % 5],
    meeting_type: ["review", "planning", "risk", "estate", "opportunity"][index % 5],
    channel: index % 2 === 0 ? "in_person" : "video",
    location: index % 2 === 0 ? "Mumbai Office" : "Meet link attached",
    notes: "Seeded meeting for advisory cadence planning.",
    starts_at: `2026-03-${String(index + 16).padStart(2, "0")}T${String(
      (index % 4) + 9
    ).padStart(2, "0")}:30:00.000Z`,
    ends_at: `2026-03-${String(index + 16).padStart(2, "0")}T${String(
      (index % 4) + 10
    ).padStart(2, "0")}:15:00.000Z`,
    status: "scheduled",
    created_by: advisorId,
  }));
}

function buildGoals(clients, advisorId) {
  return clients.map((client, index) => ({
    id: stableUuid(`goal-${index + 1}`),
    organization_id: organizationId,
    client_id: client.id,
    name: ["Retirement corpus", "Child education fund", "Second home reserve"][index % 3],
    category: ["retirement", "education", "real_estate"][index % 3],
    target_amount: 8000000 + index * 1250000,
    progress_amount: 2600000 + index * 380000,
    target_date: `${2030 + (index % 6)}-03-31`,
    status: index % 5 === 0 ? "at_risk" : "on_track",
    notes: "Financial goal seeded from the WealthFlow SRS goal-tracking requirement.",
    created_by: advisorId,
  }));
}

function buildDocuments(clients, portfolios, advisorId) {
  return clients.slice(0, 12).map((client, index) => ({
    id: stableUuid(`document-${index + 1}`),
    organization_id: organizationId,
    client_id: client.id,
    portfolio_id: portfolios[index].id,
    uploaded_by: advisorId,
    name: ["KYC Pack", "Risk Questionnaire", "Investment Policy Statement", "Signed Advisory Mandate"][index % 4],
    bucket_name: "client-documents",
    storage_path: `${organizationId}/${client.id}/document-${index + 1}.pdf`,
    file_name: `document-${index + 1}.pdf`,
    mime_type: "application/pdf",
    size_bytes: 240000 + index * 11000,
    document_category: ["compliance", "advisory", "onboarding"][index % 3],
    is_private: true,
    uploaded_at: `2026-03-${String((index % 10) + 5).padStart(2, "0")}T13:00:00.000Z`,
  }));
}

function buildNotifications(advisorId) {
  return Array.from({ length: 18 }, (_, index) => ({
    id: stableUuid(`notification-${index + 1}`),
    organization_id: organizationId,
    user_id: advisorId,
    title: [
      "Quarterly review due this week",
      "KYC document awaiting upload",
      "Client birthday reminder",
      "Compliance attestation expires tomorrow",
      "Portfolio drift crossed threshold",
      "Meeting notes pending approval",
    ][index % 6],
    body: "Seeded operational notification for dashboard rehearsal.",
    notification_type: ["task", "document", "relationship", "compliance"][index % 4],
    is_read: index % 3 === 0,
    metadata: { source: "seed-script" },
  }));
}

function buildComplianceRecords(clients, documents, advisorId) {
  return clients.slice(0, 10).map((client, index) => ({
    id: stableUuid(`compliance-${index + 1}`),
    organization_id: organizationId,
    client_id: client.id,
    related_document_id: documents[index]?.id ?? null,
    record_type: ["KYC refresh", "Suitability review", "SEBI disclosure", "Risk acknowledgement"][index % 4],
    status: index % 3 === 0 ? "attention" : "compliant",
    due_at: `2026-04-${String(index + 3).padStart(2, "0")}T00:00:00.000Z`,
    completed_at: index % 3 === 0 ? null : `2026-03-${String(index + 6).padStart(2, "0")}T08:00:00.000Z`,
    notes: "Seeded compliance record aligned with the WealthFlow compliance module.",
    created_by: advisorId,
  }));
}

function buildActivities(clients, advisorId) {
  return Array.from({ length: 30 }, (_, index) => ({
    id: stableUuid(`activity-${index + 1}`),
    organization_id: organizationId,
    client_id: clients[index % clients.length].id,
    actor_id: advisorId,
    activity_type: ["note", "call", "meeting", "document", "task"][index % 5],
    title: [
      "Updated allocation recommendation",
      "Logged inbound review request",
      "Captured meeting summary",
      "Uploaded signed advisory note",
      "Created service follow-up task",
    ][index % 5],
    description: "Seeded client activity for recent activity feeds and auditability.",
    occurred_at: `2026-03-${String((index % 12) + 1).padStart(2, "0")}T11:15:00.000Z`,
    metadata: { source: "seed-script" },
  }));
}

function buildAuditLogs(advisorId) {
  return Array.from({ length: 20 }, (_, index) => ({
    id: stableUuid(`audit-${index + 1}`),
    organization_id: organizationId,
    actor_id: advisorId,
    entity_type: ["client", "portfolio", "document", "task"][index % 4],
    entity_id: null,
    action: ["created", "updated", "reviewed", "exported"][index % 4],
    payload: { source: "seed-script", index: index + 1 },
  }));
}

async function main() {
  const advisorId = await getOrCreateAdvisorUser();

  const organizations = [
    {
      id: organizationId,
      name: "WealthFlow Advisory",
      slug: "wealthflow-advisory",
      timezone: "Asia/Kolkata",
      base_currency: "INR",
      country_code: "IN",
      created_by: advisorId,
    },
  ];

  const profiles = [
    {
      id: advisorId,
      full_name: "Neha Bansal",
      email: advisorEmail,
      phone: "+91 9890012345",
      job_title: "Senior Wealth Advisor",
    },
  ];

  const memberships = [
    {
      id: stableUuid("membership-owner-1"),
      organization_id: organizationId,
      user_id: advisorId,
      role: "owner",
      status: "active",
      joined_at: "2026-03-01T09:00:00.000Z",
      created_by: advisorId,
    },
  ];

  const riskProfiles = [
    ["Conservative", "Capital preservation first", 0, 25],
    ["Balanced", "Blend of growth and protection", 26, 50],
    ["Growth", "Higher equity orientation", 51, 75],
    ["Aggressive", "Long-horizon growth mandate", 76, 100],
  ].map(([name, description, scoreMin, scoreMax], index) => ({
    id: stableUuid(`risk-profile-${index + 1}`),
    organization_id: organizationId,
    name,
    description,
    score_min: scoreMin,
    score_max: scoreMax,
    created_by: advisorId,
  }));

  const clients = buildClients(advisorId);
  const portfolios = buildPortfolios(clients, advisorId);
  const accounts = buildAccounts(clients, portfolios);
  const securities = buildSecurities();
  const transactions = buildTransactions(
    clients,
    portfolios,
    accounts,
    securities,
    advisorId
  );
  const snapshots = buildSnapshots(portfolios);
  const tasks = buildTasks(clients, portfolios, advisorId);
  const meetings = buildMeetings(clients, advisorId);
  const goals = buildGoals(clients, advisorId);
  const documents = buildDocuments(clients, portfolios, advisorId);
  const notifications = buildNotifications(advisorId);
  const complianceRecords = buildComplianceRecords(clients, documents, advisorId);
  const activities = buildActivities(clients, advisorId);
  const auditLogs = buildAuditLogs(advisorId);

  await upsert("organizations", organizations);
  await upsert("profiles", profiles);
  await upsert("organization_memberships", memberships);
  await upsert("risk_profiles", riskProfiles);
  await upsert("clients", clients);
  await upsert("portfolios", portfolios);
  await upsert("accounts", accounts);
  await upsert("securities", securities);
  await upsert("portfolio_snapshots", snapshots);
  await upsert("transactions", transactions);
  await upsert("tasks", tasks);
  await upsert("meetings", meetings);
  await upsert("goals", goals);
  await upsert("documents", documents);
  await upsert("notifications", notifications);
  await upsert("compliance_records", complianceRecords);
  await upsert("client_activities", activities);
  await upsert("audit_logs", auditLogs);

  console.log("WealthFlow seed complete.");
  console.log(`Organization: ${organizations[0].name}`);
  console.log(`Advisor email: ${advisorEmail}`);
  console.log("Advisor password: WealthFlow123!");
  console.log(`Clients: ${clients.length}`);
  console.log(`Portfolios: ${portfolios.length}`);
  console.log(`Transactions: ${transactions.length}`);
  console.log(`Tasks: ${tasks.length}`);
  console.log(`Meetings: ${meetings.length}`);
}

main().catch((error) => {
  console.error("WealthFlow seed failed.");
  console.error(error);
  process.exit(1);
});
