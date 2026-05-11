import { useAuth } from "@/auth/AuthContext";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { DashboardActivityCard } from "@/components/dashboard/DashboardActivityCard";
import { DashboardAttentionCard } from "@/components/dashboard/DashboardAttentionCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardIntegrationsCard } from "@/components/dashboard/DashboardIntegrationsCard";
import { DashboardLeadsChart } from "@/components/dashboard/DashboardLeadsChart";
import { DashboardQuickActionsCard } from "@/components/dashboard/DashboardQuickActionsCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { money, moneyCompact } from "@/components/dashboard/dashboardFormatters";
import { DASHBOARD_RANGE_OPTIONS, type DashboardDateRangeKey } from "@/mocks/dashboard";
import { mockQueueJobs } from "@/mocks/integrations";
import { getDashboardSnapshot } from "@/services/dashboardSnapshot";
import { useQuery } from "@tanstack/react-query";
import { Building2, GitBranch, Users, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

export function DashboardPage() {
  const [dateRange, setDateRange] = useState<DashboardDateRangeKey>("12m");
  const { user, can } = useAuth();
  const q = useQuery({
    queryKey: ["dashboard", dateRange],
    queryFn: () => getDashboardSnapshot(dateRange),
  });

  const kpis = q.data?.kpis;
  const chartRows = q.data?.leadsChart ?? [];
  const activity = q.data?.activity ?? [];
  const loading = q.isLoading;

  const failedJobs = useMemo(() => mockQueueJobs.filter((j) => j.status === "failed"), []);

  const updatedLabel = q.dataUpdatedAt
    ? new Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(new Date(q.dataUpdatedAt))
    : null;

  const rangeLabel = DASHBOARD_RANGE_OPTIONS.find((o) => o.key === dateRange)?.label ?? "Selected period";

  return (
    <div className="space-y-8">
      <DashboardHeader
        userName={user?.name}
        updatedLabel={updatedLabel}
        isFetching={q.isFetching}
        onRefresh={() => void q.refetch()}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label={`New leads (${rangeLabel})`}
          footNote="Rolling window matches reporting range above."
          loading={loading}
          icon={Users}
          trendPct={kpis?.leadsTrendPct}
          value={kpis?.leadsNew ?? "—"}
        />
        <PermissionGate permission="crm.read">
          <KpiCard
            label="Pipeline value"
            loading={loading}
            icon={GitBranch}
            trendPct={kpis?.pipelineTrendPct}
            value={kpis ? moneyCompact(kpis.pipelineValue) : "—"}
          />
        </PermissionGate>
        <PermissionGate permission="properties.read">
          <KpiCard
            label="Published listings"
            loading={loading}
            icon={Building2}
            trendPct={kpis?.listingsTrendPct}
            value={kpis?.publishedListings ?? "—"}
          />
        </PermissionGate>
        <PermissionGate permission="finance.read">
          <KpiCard
            label="Cash balance"
            loading={loading}
            icon={Wallet}
            trendPct={kpis?.cashTrendPct}
            value={kpis ? money(kpis.cashBalance) : "—"}
          />
        </PermissionGate>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <DashboardLeadsChart loading={loading} chartRows={chartRows} />
        <DashboardActivityCard loading={loading} activity={activity} canViewLeads={can("crm.read")} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardIntegrationsCard />
        <DashboardQuickActionsCard
          canPropertiesWrite={can("properties.write")}
          canCrmRead={can("crm.read")}
          canCommercialRead={can("commercial.read")}
        />
        <DashboardAttentionCard failedJobs={failedJobs} />
      </div>
    </div>
  );
}
