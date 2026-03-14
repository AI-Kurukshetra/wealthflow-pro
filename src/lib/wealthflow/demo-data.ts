import { createHash } from "node:crypto";

type AdvisorSeed = {
  id: string;
  email: string;
  fullName: string;
};

type SeedClient = {
  id: string;
  organization_id: string;
  primary_advisor_id: string;
  household_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  city: string;
  client_status: string;
  risk_profile: string;
  source: string;
  notes: string;
  created_by: string;
};

type SeedPortfolio = {
  id: string;
  organization_id: string;
  client_id: string;
  advisor_id: string;
  name: string;
  account_type: string;
  custodian: string;
  account_mask: string;
  base_currency: string;
  market_value: number;
  cost_basis: number;
  portfolio_status: string;
  inception_date: string;
  created_by: string;
};

type SeedAccount = {
  id: string;
  organization_id: string;
  portfolio_id: string;
  client_id: string;
  account_number_mask: string;
  account_type: string;
  custodian: string;
  status: string;
};

type SeedSecurity = {
  id: string;
  organization_id: string;
  symbol: string;
  name: string;
  asset_class: string;
  exchange: string;
  isin: string;
  currency: string;
};

type SeedSnapshot = {
  id: string;
  organization_id: string;
  portfolio_id: string;
  snapshot_date: string;
  market_value: number;
  cash_balance: number;
  cost_basis: number;
  gain_loss: number;
  gain_loss_percent: number;
};

type SeedTransaction = {
  id: string;
  organization_id: string;
  portfolio_id: string;
  account_id: string;
  client_id: string;
  security_id: string;
  transaction_type: string;
  trade_date: string;
  settlement_date: string;
  security_symbol: string;
  description: string;
  quantity: number;
  price: number;
  gross_amount: number;
  fees: number;
  net_amount: number;
  currency: string;
  external_reference: string;
  created_by: string;
};

type SeedTask = {
  id: string;
  organization_id: string;
  client_id: string;
  portfolio_id: string;
  title: string;
  description: string;
  task_type: string;
  priority: string;
  status: string;
  assigned_to: string;
  created_by: string;
  due_at: string;
};

type SeedMeeting = {
  id: string;
  organization_id: string;
  client_id: string;
  advisor_id: string;
  title: string;
  meeting_type: string;
  channel: string;
  location: string;
  notes: string;
  starts_at: string;
  ends_at: string;
  status: string;
  created_by: string;
};

type SeedGoal = {
  id: string;
  organization_id: string;
  client_id: string;
  name: string;
  category: string;
  target_amount: number;
  progress_amount: number;
  target_date: string;
  status: string;
  notes: string;
  created_by: string;
};

type SeedNotification = {
  id: string;
  organization_id: string;
  user_id: string;
  title: string;
  body: string;
  notification_type: string;
  is_read: boolean;
  metadata: { source: string };
};

type SeedActivity = {
  id: string;
  organization_id: string;
  client_id: string;
  actor_id: string;
  activity_type: string;
  title: string;
  description: string;
  occurred_at: string;
  metadata: { source: string };
};

export type SeedDocument = {
  id: string;
  organization_id: string;
  client_id: string;
  portfolio_id: string;
  uploaded_by: string;
  name: string;
  bucket_name: "client-documents";
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  document_category: string;
  is_private: true;
  uploaded_at: string;
  file_contents: string;
};

export type DemoWorkspaceSeed = {
  organization: {
    id: string;
    name: string;
    slug: string;
    timezone: string;
    base_currency: string;
    country_code: string;
    created_by: string;
  };
  profile: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    job_title: string;
  };
  riskProfiles: Array<{
    id: string;
    organization_id: string;
    name: string;
    description: string;
    score_min: number;
    score_max: number;
    created_by: string;
  }>;
  clients: SeedClient[];
  portfolios: SeedPortfolio[];
  accounts: SeedAccount[];
  securities: SeedSecurity[];
  snapshots: SeedSnapshot[];
  transactions: SeedTransaction[];
  tasks: SeedTask[];
  meetings: SeedMeeting[];
  goals: SeedGoal[];
  notifications: SeedNotification[];
  activities: SeedActivity[];
  documents: SeedDocument[];
};

type RiskProfileSeed = [name: string, description: string, scoreMin: number, scoreMax: number];

export function stableUuid(seed: string) {
  const hex = createHash("sha256").update(seed).digest("hex").slice(0, 32);

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
    12,
    16
  )}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function buildClients(organizationId: string, advisor: AdvisorSeed) {
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
    id: stableUuid(`${organizationId}:client:${index + 1}`),
    organization_id: organizationId,
    primary_advisor_id: advisor.id,
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
    created_by: advisor.id,
  }));
}

function buildPortfolios(
  organizationId: string,
  clients: SeedClient[],
  advisor: AdvisorSeed
) {
  return clients.map((client, index) => ({
    id: stableUuid(`${organizationId}:portfolio:${index + 1}`),
    organization_id: organizationId,
    client_id: client.id,
    advisor_id: advisor.id,
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
    created_by: advisor.id,
  }));
}

function buildAccounts(
  organizationId: string,
  clients: SeedClient[],
  portfolios: SeedPortfolio[]
) {
  return portfolios.map((portfolio, index) => ({
    id: stableUuid(`${organizationId}:account:${index + 1}`),
    organization_id: organizationId,
    portfolio_id: portfolio.id,
    client_id: clients[index].id,
    account_number_mask: `XXXX-XX-${4401 + index}`,
    account_type: portfolio.account_type,
    custodian: portfolio.custodian,
    status: "active",
  }));
}

function buildSecurities(organizationId: string) {
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
    id: stableUuid(`${organizationId}:security:${index + 1}`),
    organization_id: organizationId,
    symbol,
    name,
    asset_class: assetClass,
    exchange: "NSE",
    isin: `INE${String(100000000 + index).slice(0, 9)}`,
    currency: "INR",
  }));
}

function buildSnapshots(organizationId: string, portfolios: SeedPortfolio[]) {
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
        id: stableUuid(`${organizationId}:snapshot:${portfolio.id}:${snapshotDate}`),
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

function buildTransactions(
  organizationId: string,
  clients: SeedClient[],
  portfolios: SeedPortfolio[],
  accounts: SeedAccount[],
  securities: SeedSecurity[],
  advisor: AdvisorSeed
) {
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
      id: stableUuid(`${organizationId}:transaction:${index + 1}`),
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
        index % 5 === 3
          ? Number((gross - fees).toFixed(2))
          : Number((gross + fees).toFixed(2)),
      currency: "INR",
      external_reference: `WF-TXN-${String(index + 1).padStart(4, "0")}`,
      created_by: advisor.id,
    };
  });
}

function buildTasks(
  organizationId: string,
  clients: SeedClient[],
  portfolios: SeedPortfolio[],
  advisor: AdvisorSeed
) {
  return Array.from({ length: 15 }, (_, index) => ({
    id: stableUuid(`${organizationId}:task:${index + 1}`),
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
    assigned_to: advisor.id,
    created_by: advisor.id,
    due_at: `2026-03-${String((index % 10) + 15).padStart(2, "0")}T09:00:00.000Z`,
  }));
}

function buildMeetings(
  organizationId: string,
  clients: SeedClient[],
  advisor: AdvisorSeed
) {
  return Array.from({ length: 10 }, (_, index) => ({
    id: stableUuid(`${organizationId}:meeting:${index + 1}`),
    organization_id: organizationId,
    client_id: clients[index * 2]?.id ?? clients[index].id,
    advisor_id: advisor.id,
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
    created_by: advisor.id,
  }));
}

function buildGoals(organizationId: string, clients: SeedClient[], advisor: AdvisorSeed) {
  return clients.map((client, index) => ({
    id: stableUuid(`${organizationId}:goal:${index + 1}`),
    organization_id: organizationId,
    client_id: client.id,
    name: ["Retirement corpus", "Child education fund", "Second home reserve"][index % 3],
    category: ["retirement", "education", "real_estate"][index % 3],
    target_amount: 8000000 + index * 1250000,
    progress_amount: 2600000 + index * 380000,
    target_date: `${2030 + (index % 6)}-03-31`,
    status: index % 5 === 0 ? "at_risk" : "on_track",
    notes: "Financial goal seeded from the WealthFlow SRS goal-tracking requirement.",
    created_by: advisor.id,
  }));
}

function buildNotifications(organizationId: string, advisor: AdvisorSeed) {
  return Array.from({ length: 18 }, (_, index) => ({
    id: stableUuid(`${organizationId}:notification:${index + 1}`),
    organization_id: organizationId,
    user_id: advisor.id,
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
    metadata: { source: "demo-bootstrap" },
  }));
}

function buildActivities(organizationId: string, clients: SeedClient[], advisor: AdvisorSeed) {
  return Array.from({ length: 30 }, (_, index) => ({
    id: stableUuid(`${organizationId}:activity:${index + 1}`),
    organization_id: organizationId,
    client_id: clients[index % clients.length].id,
    actor_id: advisor.id,
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
    metadata: { source: "demo-bootstrap" },
  }));
}

function buildDocuments(
  organizationId: string,
  clients: SeedClient[],
  portfolios: SeedPortfolio[],
  advisor: AdvisorSeed
) {
  return clients.slice(0, 6).map((client, index) => {
    const fileName = `wealthflow-document-${index + 1}.txt`;

    return {
      id: stableUuid(`${organizationId}:document:${index + 1}`),
      organization_id: organizationId,
      client_id: client.id,
      portfolio_id: portfolios[index].id,
      uploaded_by: advisor.id,
      name: [
        "KYC Pack",
        "Risk Questionnaire",
        "Investment Policy Statement",
        "Signed Advisory Mandate",
      ][index % 4],
      bucket_name: "client-documents" as const,
      storage_path: `${organizationId}/${client.id}/${fileName}`,
      file_name: fileName,
      mime_type: "text/plain",
      size_bytes: 0,
      document_category: ["compliance", "advisory", "onboarding"][index % 3],
      is_private: true as const,
      uploaded_at: `2026-03-${String((index % 10) + 5).padStart(2, "0")}T13:00:00.000Z`,
      file_contents: [
        "Client KYC checklist and identity verification notes.",
        "Risk tolerance questionnaire with advisor summary.",
        "Investment policy statement for model portfolio alignment.",
        "Signed advisory mandate and disclosure acknowledgement.",
      ][index % 4],
    };
  });
}

export function buildDemoWorkspaceSeed(user: AdvisorSeed): DemoWorkspaceSeed {
  const organizationId = stableUuid(`wealthflow-organization:${user.id}`);
  const organizationName = "WealthFlow Advisory";
  const slug = `wealthflow-${user.id.slice(0, 8)}`;
  const clients = buildClients(organizationId, user);
  const portfolios = buildPortfolios(organizationId, clients, user);
  const accounts = buildAccounts(organizationId, clients, portfolios);
  const securities = buildSecurities(organizationId);
  const snapshots = buildSnapshots(organizationId, portfolios);
  const transactions = buildTransactions(
    organizationId,
    clients,
    portfolios,
    accounts,
    securities,
    user
  );

  const riskProfiles: RiskProfileSeed[] = [
    ["Conservative", "Capital preservation first", 0, 25],
    ["Balanced", "Blend of growth and protection", 26, 50],
    ["Growth", "Higher equity orientation", 51, 75],
    ["Aggressive", "Long-horizon growth mandate", 76, 100],
  ];

  return {
    organization: {
      id: organizationId,
      name: organizationName,
      slug,
      timezone: "Asia/Kolkata",
      base_currency: "INR",
      country_code: "IN",
      created_by: user.id,
    },
    profile: {
      id: user.id,
      full_name: user.fullName,
      email: user.email,
      phone: "+91 9890012345",
      job_title: "Senior Wealth Advisor",
    },
    riskProfiles: riskProfiles.map(([name, description, scoreMin, scoreMax], index) => ({
      id: stableUuid(`${organizationId}:risk-profile:${index + 1}`),
      organization_id: organizationId,
      name,
      description,
      score_min: scoreMin,
      score_max: scoreMax,
      created_by: user.id,
    })),
    clients,
    portfolios,
    accounts,
    securities,
    snapshots,
    transactions,
    tasks: buildTasks(organizationId, clients, portfolios, user),
    meetings: buildMeetings(organizationId, clients, user),
    goals: buildGoals(organizationId, clients, user),
    notifications: buildNotifications(organizationId, user),
    activities: buildActivities(organizationId, clients, user),
    documents: buildDocuments(organizationId, clients, portfolios, user),
  };
}
