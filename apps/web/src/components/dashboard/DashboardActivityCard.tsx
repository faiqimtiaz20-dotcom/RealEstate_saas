import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatRelativeShort } from "@/components/dashboard/dashboardFormatters";
import type { DashboardActivityItem, DashboardActivityKind } from "@/mocks/dashboard";
import { ArrowRight, Handshake, Home, RefreshCw, UserPlus, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

const activityIcon: Record<DashboardActivityKind, LucideIcon> = {
  lead: UserPlus,
  deal: Handshake,
  listing: Home,
  sync: RefreshCw,
};

type Props = {
  loading: boolean;
  activity: DashboardActivityItem[];
  canViewLeads: boolean;
};

export function DashboardActivityCard({ loading, activity, canViewLeads }: Props) {
  return (
    <Card className="flex flex-col border-border/90 shadow-sm lg:col-span-4">
      <CardHeader className="border-b border-border/80 pb-4">
        <CardTitle className="text-base sm:text-lg">Activity</CardTitle>
        <CardDescription>Recent events across CRM and listings (filtered by range).</CardDescription>
      </CardHeader>
      <ul className="max-h-[22rem] flex-1 divide-y divide-border overflow-y-auto px-1">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="flex gap-3 px-3 py-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2 pt-0.5">
                  <Skeleton className="h-4 w-[85%]" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </li>
            ))
          : activity.map((item) => {
              const Icon = activityIcon[item.kind];
              return (
                <li key={item.id} className="flex gap-3 px-3 py-3.5 transition hover:bg-accent/50">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-foreground ring-1 ring-border">
                    <Icon className="h-4 w-4 opacity-90" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.description}</p>
                    <p className="mt-1.5 text-[11px] font-medium text-muted">{formatRelativeShort(item.at)}</p>
                  </div>
                </li>
              );
            })}
      </ul>
      <div className="border-t border-border px-4 py-3">
        {canViewLeads ? (
          <Link
            to="/crm/leads"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all leads
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <p className="text-xs text-muted">CRM access required to open leads.</p>
        )}
      </div>
    </Card>
  );
}
