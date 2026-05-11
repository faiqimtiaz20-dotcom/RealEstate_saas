import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { TrendBadge } from "@/components/dashboard/TrendBadge";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  loading,
  icon: Icon,
  trendPct,
  footNote = "vs previous period (demo data)",
}: {
  label: string;
  value: ReactNode;
  loading: boolean;
  icon: LucideIcon;
  trendPct?: number;
  footNote?: string;
}) {
  return (
    <Card className="relative overflow-hidden border-border/90 p-0 shadow-sm">
      <div className="absolute inset-y-0 left-0 w-1 bg-primary/85" aria-hidden />
      <div className="p-5 pl-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
              {loading ? (
                <Skeleton className="mt-2 h-9 w-28 max-w-full" />
              ) : (
                <p className="mt-1 truncate text-2xl font-semibold tracking-tight text-foreground tabular-nums sm:text-3xl">
                  {value}
                </p>
              )}
            </div>
          </div>
          {!loading && trendPct !== undefined ? <TrendBadge pct={trendPct} /> : null}
        </div>
        <p className="mt-3 text-xs text-muted">{footNote}</p>
      </div>
    </Card>
  );
}
