export type DashboardKpis = {
  leadsNew: number;
  leadsTrendPct: number;
  pipelineValue: number;
  pipelineTrendPct: number;
  publishedListings: number;
  listingsTrendPct: number;
  integrationErrors: number;
  cashBalance: number;
  cashTrendPct: number;
};

export type DashboardActivityKind = "lead" | "deal" | "listing" | "sync";

export type DashboardActivityItem = {
  id: string;
  kind: DashboardActivityKind;
  title: string;
  description: string;
  at: string;
};

export type LeadsChartRow = { month: string; leads: number; tours: number };

export type DashboardData = {
  kpis: DashboardKpis;
  activity: DashboardActivityItem[];
  leadsChart: LeadsChartRow[];
};

/** Presets for the dashboard range selector (query param when live API is on). */
export type DashboardDateRangeKey = "7d" | "30d" | "90d" | "12m";

export const DASHBOARD_RANGE_OPTIONS: { key: DashboardDateRangeKey; label: string }[] = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
  { key: "12m", label: "12 months" },
];

const RANGE_DAYS: Record<DashboardDateRangeKey, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "12m": 365,
};

const BASE_KPIS: DashboardKpis = {
  leadsNew: 12,
  leadsTrendPct: 8,
  pipelineValue: 4_200_000,
  pipelineTrendPct: 3.2,
  publishedListings: 48,
  listingsTrendPct: -2.1,
  integrationErrors: 2,
  cashBalance: 128_400,
  cashTrendPct: 1.2,
};

const BASE_CHART: LeadsChartRow[] = [
  { month: "Nov", leads: 18, tours: 11 },
  { month: "Dec", leads: 22, tours: 14 },
  { month: "Jan", leads: 15, tours: 9 },
  { month: "Feb", leads: 20, tours: 12 },
  { month: "Mar", leads: 26, tours: 17 },
  { month: "Apr", leads: 24, tours: 15 },
  { month: "May", leads: 12, tours: 8 },
];

const BASE_ACTIVITY: DashboardActivityItem[] = [
  {
    id: "a1",
    kind: "lead",
    title: "WhatsApp lead captured",
    description: "Marina — 3-bed apartment inquiry",
    at: "2026-05-11T14:20:00Z",
  },
  {
    id: "a2",
    kind: "deal",
    title: "Deal moved to negotiation",
    description: "Copacabana penthouse — R$ 2.4M",
    at: "2026-05-11T11:05:00Z",
  },
  {
    id: "a3",
    kind: "listing",
    title: "Listing published",
    description: "OLX — Jardins studio with parking",
    at: "2026-05-10T16:40:00Z",
  },
  {
    id: "a4",
    kind: "sync",
    title: "Portal sync completed",
    description: "Zap Imóveis — 6 listings updated",
    at: "2026-05-10T09:15:00Z",
  },
  {
    id: "a5",
    kind: "lead",
    title: "Website form submitted",
    description: "Pinheiros — buyer budget up to R$ 1.8M",
    at: "2026-05-09T18:22:00Z",
  },
  {
    id: "a6",
    kind: "deal",
    title: "Offer registered",
    description: "Moema — resale 140m²",
    at: "2026-04-28T10:00:00Z",
  },
  {
    id: "a7",
    kind: "listing",
    title: "Price updated",
    description: "Itaim — rent dropped 4%",
    at: "2026-03-15T12:30:00Z",
  },
];

function chartSliceLength(range: DashboardDateRangeKey): number {
  switch (range) {
    case "7d":
      return 3;
    case "30d":
      return 4;
    case "90d":
      return 6;
    case "12m":
    default:
      return BASE_CHART.length;
  }
}

function leadsMultiplier(range: DashboardDateRangeKey): number {
  switch (range) {
    case "7d":
      return 1;
    case "30d":
      return 2.75;
    case "90d":
      return 4.25;
    case "12m":
    default:
      return 11.5;
  }
}

function pipelineMultiplier(range: DashboardDateRangeKey): number {
  switch (range) {
    case "7d":
      return 1;
    case "30d":
      return 1.02;
    case "90d":
      return 1.05;
    case "12m":
    default:
      return 1.12;
  }
}

/** Mock fetch: shape matches `GET /v1/dashboard/summary?range=` for live swap. */
export async function fetchDashboardData(range: DashboardDateRangeKey = "12m"): Promise<DashboardData> {
  await new Promise((r) => setTimeout(r, 480));
  const days = RANGE_DAYS[range];
  const cutoff = Date.now() - days * 86_400_000;
  const activity = BASE_ACTIVITY.filter((a) => new Date(a.at).getTime() >= cutoff);
  const leadsChart = BASE_CHART.slice(-chartSliceLength(range));
  const lm = leadsMultiplier(range);
  const pm = pipelineMultiplier(range);

  return {
    kpis: {
      ...BASE_KPIS,
      leadsNew: Math.max(1, Math.round(BASE_KPIS.leadsNew * lm)),
      leadsTrendPct: range === "7d" ? 8 : range === "30d" ? 5.2 : range === "90d" ? 3.1 : 2.4,
      pipelineValue: Math.round(BASE_KPIS.pipelineValue * pm),
      pipelineTrendPct: range === "12m" ? 4.8 : BASE_KPIS.pipelineTrendPct,
      listingsTrendPct: range === "12m" ? 1.2 : BASE_KPIS.listingsTrendPct,
    },
    activity,
    leadsChart,
  };
}
