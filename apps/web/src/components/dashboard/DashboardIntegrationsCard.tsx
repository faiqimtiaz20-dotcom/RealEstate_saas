import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { channelBadgeTone, formatSyncTime } from "@/components/dashboard/dashboardFormatters";
import { mockChannels } from "@/mocks/integrations";
import { ArrowRight, Plug } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardIntegrationsCard() {
  const integrationErrors = mockChannels.filter((c) => c.status === "error").length;

  return (
    <Card className="border-border/90 shadow-sm">
      <CardHeader className="border-b border-border/80 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">Integrations</CardTitle>
            <CardDescription>
              {integrationErrors} channel{integrationErrors === 1 ? "" : "s"} need attention
            </CardDescription>
          </div>
          <Plug className="h-5 w-5 shrink-0 text-muted" aria-hidden />
        </div>
      </CardHeader>
      <ul className="divide-y divide-border">
        {mockChannels.map((c) => (
          <li key={c.id} className="flex flex-col gap-1.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{c.label}</p>
              <p className="text-xs text-muted">Last sync: {formatSyncTime(c.lastSync)}</p>
              {c.lastError ? <p className="mt-1 text-xs text-danger">{c.lastError}</p> : null}
            </div>
            <Badge tone={channelBadgeTone(c.status)} className="w-fit capitalize">
              {c.status}
            </Badge>
          </li>
        ))}
      </ul>
      <div className="border-t border-border px-4 py-3">
        <Link
          to="/integrations"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Manage integrations
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
