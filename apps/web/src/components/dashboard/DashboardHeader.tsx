import { Badge } from "@/components/ui/Badge";
import { DashboardDateRangePicker } from "@/components/dashboard/DashboardDateRangePicker";
import { cn } from "@/lib/cn";
import type { DashboardDateRangeKey } from "@/mocks/dashboard";
import { RefreshCw } from "lucide-react";

type Props = {
  userName?: string | null;
  updatedLabel: string | null;
  isFetching: boolean;
  onRefresh: () => void;
  dateRange: DashboardDateRangeKey;
  onDateRangeChange: (next: DashboardDateRangeKey) => void;
};

export function DashboardHeader({
  userName,
  updatedLabel,
  isFetching,
  onRefresh,
  dateRange,
  onDateRangeChange,
}: Props) {
  return (
    <div className="space-y-4 border-b border-border pb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Dashboard</h1>
            <Badge tone="primary" className="font-normal">
              Overview
            </Badge>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            Welcome back, {userName ?? "there"}. KPIs, chart, and activity use the reporting range below.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
          {updatedLabel ? (
            <p className="text-xs text-muted">
              Refreshed at <span className="font-medium text-foreground">{updatedLabel}</span>
            </p>
          ) : (
            <p className="text-xs text-muted">Loading snapshot…</p>
          )}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-50"
            onClick={onRefresh}
            disabled={isFetching}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
            Refresh
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-muted">Reporting range</p>
        <DashboardDateRangePicker value={dateRange} onChange={onDateRangeChange} />
      </div>
    </div>
  );
}
