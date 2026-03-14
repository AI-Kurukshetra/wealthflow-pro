type ClientStatus = "Active" | "Onboarding" | "Needs review";
type Priority = "High" | "Medium" | "Low";

const clientSeed = [
  "Aarav & Meera Shah",
  "Rohan Malhotra",
  "Nisha Kapoor",
  "Dev Patel Family",
  "Sanjay Bedi",
  "Ishita Rao",
  "Kunal Deshpande",
  "Priya Sethi",
  "Ananya Ghosh",
  "Arjun Nair",
  "Mira Vora",
  "Kabir Khanna",
  "Tara Anand",
  "Neil Chawla",
  "Diya Menon",
  "Vikram Joshi",
  "Leena Dutt",
  "Rahul Tandon",
  "Aisha Mirza",
  "Yash Mehta",
];

const clientStatuses: ClientStatus[] = [
  "Active",
  "Active",
  "Onboarding",
  "Needs review",
];
const riskProfiles = ["Conservative", "Balanced", "Growth", "Aggressive"];

export const advisorProfile = {
  name: "Neha Bansal",
  email: "neha.bansal@wealthflow.in",
  title: "Senior Wealth Advisor",
  initials: "NB",
  firm: "WealthFlow Advisory",
};

export const clients = clientSeed.map((name, index) => ({
  id: `client-${String(index + 1).padStart(3, "0")}`,
  name,
  email:
    name
      .toLowerCase()
      .replace(/[^a-z]+/g, ".")
      .replace(/^\.+|\.+$/g, "") + "@example.com",
  phone: `+91 98${String(10000000 + index * 3412).slice(0, 8)}`,
  status: clientStatuses[index % clientStatuses.length],
  riskProfile: riskProfiles[index % riskProfiles.length],
  aum: 9_500_000 + index * 2_150_000,
  nextReviewAt: `2026-03-${String((index % 12) + 15).padStart(2, "0")}T10:30:00.000Z`,
  segment:
    index % 4 === 0 ? "Ultra HNI" : index % 3 === 0 ? "HNI" : "Affluent",
  city: ["Mumbai", "Bengaluru", "Delhi", "Pune", "Hyderabad"][index % 5],
}));

export const portfolios = clients.map((client, index) => ({
  id: `portfolio-${String(index + 1).padStart(3, "0")}`,
  clientId: client.id,
  clientName: client.name,
  name: `${client.name.split(" ")[0]} Core Wealth`,
  accountType:
    index % 3 === 0
      ? "Advisory PMS"
      : index % 2 === 0
        ? "Mutual Fund Wrap"
        : "Discretionary",
  custodian: ["HDFC Securities", "ICICI Direct", "Axis Capital"][index % 3],
  value: client.aum,
  ytdPerformance: 6.5 + (index % 6) * 1.4,
  cashAllocation: 7 + (index % 5) * 2,
  equityAllocation: 44 + (index % 6) * 4,
  debtAllocation: 22 + (index % 4) * 5,
  alternativesAllocation: 8 + (index % 3) * 4,
}));

export const transactions = portfolios.flatMap((portfolio, index) =>
  Array.from({ length: 5 }, (_, offset) => ({
    id: `txn-${String(index * 5 + offset + 1).padStart(3, "0")}`,
    portfolioId: portfolio.id,
    clientName: portfolio.clientName,
    tradeDate: `2026-03-${String(((index + offset) % 12) + 1).padStart(2, "0")}T05:30:00.000Z`,
    type: ["Buy", "SIP", "Rebalance", "Dividend", "Sell"][offset % 5],
    security: [
      "HDFC Flexi Cap",
      "Nifty 50 ETF",
      "Axis Short Term Bond",
      "ICICI Banking Fund",
      "Bharat Bond ETF",
    ][(index + offset) % 5],
    amount: 95_000 + index * 12_500 + offset * 18_000,
  }))
);

export const tasks = Array.from({ length: 15 }, (_, index) => ({
  id: `task-${String(index + 1).padStart(3, "0")}`,
  title: [
    "Prepare quarterly review deck",
    "Upload FATCA declaration",
    "Rebalance equity sleeve",
    "Send tax harvesting memo",
    "Confirm nominee details",
  ][index % 5],
  clientName: clients[index % clients.length].name,
  dueAt: `2026-03-${String((index % 9) + 15).padStart(2, "0")}T09:00:00.000Z`,
  priority: (["High", "Medium", "Low"] as Priority[])[index % 3],
  status:
    index % 4 === 0 ? "Blocked" : index % 3 === 0 ? "In progress" : "Open",
}));

export const meetings = Array.from({ length: 10 }, (_, index) => ({
  id: `meeting-${String(index + 1).padStart(3, "0")}`,
  title: [
    "Annual review",
    "Goal planning",
    "Risk calibration",
    "Estate planning",
    "Opportunity check-in",
  ][index % 5],
  clientName: clients[index * 2]?.name ?? clients[index].name,
  startsAt: `2026-03-${String(index + 16).padStart(2, "0")}T${String(
    (index % 4) + 9
  ).padStart(2, "0")}:30:00.000Z`,
  channel: index % 2 === 0 ? "In person" : "Video",
  location: index % 2 === 0 ? "Mumbai Office" : "Meet link attached",
}));

export const goals = clients.slice(0, 12).map((client, index) => ({
  id: `goal-${String(index + 1).padStart(3, "0")}`,
  clientId: client.id,
  clientName: client.name,
  name: [
    "Retirement corpus",
    "Child education fund",
    "Second home down payment",
  ][index % 3],
  targetAmount: 8_000_000 + index * 1_250_000,
  progressPercent: 28 + (index % 6) * 10,
  targetDate: `${2030 + (index % 6)}-03-31`,
}));

export const documents = clients.slice(0, 12).map((client, index) => ({
  id: `document-${String(index + 1).padStart(3, "0")}`,
  clientName: client.name,
  name: [
    "KYC Pack",
    "Risk Questionnaire",
    "Investment Policy Statement",
    "Signed Advisory Mandate",
  ][index % 4],
  category: ["Compliance", "Advisory", "Onboarding"][index % 3],
  uploadedAt: `2026-03-${String((index % 10) + 5).padStart(2, "0")}T13:00:00.000Z`,
}));

export const notifications = Array.from({ length: 6 }, (_, index) => ({
  id: `notification-${index + 1}`,
  title: [
    "Quarterly review due this week",
    "KYC document awaiting upload",
    "Client birthday reminder",
    "Compliance attestation expires tomorrow",
    "Portfolio drift crossed threshold",
    "Meeting notes pending approval",
  ][index],
  kind: index % 2 === 0 ? "Action" : "FYI",
}));

export const recentActivity = Array.from({ length: 6 }, (_, index) => ({
  id: `activity-${index + 1}`,
  clientName: clients[index].name,
  title: [
    "Updated strategic allocation after risk review",
    "Uploaded signed mandate and opened service task",
    "Completed portfolio review and sent summary note",
    "Scheduled tax planning meeting with spouse included",
    "Logged inbound call about SIP top-up request",
    "Issued compliance reminder for document renewal",
  ][index],
  occurredAt: `2026-03-${String(index + 8).padStart(2, "0")}T11:15:00.000Z`,
}));

export const monthlyPerformance = [
  { label: "Oct", value: 332_000_000 },
  { label: "Nov", value: 338_500_000 },
  { label: "Dec", value: 344_800_000 },
  { label: "Jan", value: 351_100_000 },
  { label: "Feb", value: 356_300_000 },
  { label: "Mar", value: 362_400_000 },
];

export const complianceRecords = clients.slice(0, 10).map((client, index) => ({
  id: `compliance-${String(index + 1).padStart(3, "0")}`,
  clientName: client.name,
  recordType: [
    "KYC refresh",
    "Suitability review",
    "SEBI disclosure",
    "Risk acknowledgement",
  ][index % 4],
  dueAt: `2026-04-${String(index + 3).padStart(2, "0")}T00:00:00.000Z`,
  status: index % 3 === 0 ? "Attention" : "Compliant",
}));

export const dashboardMetrics = {
  totalAum: portfolios.reduce((sum, item) => sum + item.value, 0),
  activeClients: clients.filter((client) => client.status === "Active").length,
  upcomingTasks: tasks.filter((task) => task.status !== "Done").length,
};
