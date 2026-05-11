import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatSyncTime } from "@/components/dashboard/dashboardFormatters";
import type { QueueJob } from "@/mocks/integrations";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  failedJobs: QueueJob[];
};

export function DashboardAttentionCard({ failedJobs }: Props) {
  return (
    <Card className="border-border/90 shadow-sm ring-1 ring-warning/25">
      <CardHeader className="border-b border-border/80 pb-4">
        <div className="flex items-start gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/20 text-foreground">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div>
            <CardTitle className="text-base">Needs attention</CardTitle>
            <CardDescription>Failed jobs and integration errors (mock queue).</CardDescription>
          </div>
        </div>
      </CardHeader>
      <ul className="space-y-3 px-4 py-3">
        {failedJobs.length === 0 ? (
          <li className="text-sm text-muted">No failed jobs in the demo queue.</li>
        ) : (
          failedJobs.map((job) => (
            <li
              key={job.id}
              className="rounded-md border border-border bg-card/80 px-3 py-2.5 text-sm shadow-sm"
            >
              <p className="font-medium text-foreground">{job.propertyTitle}</p>
              <p className="mt-1 text-xs text-muted">
                {job.type} · {job.channel} · {job.attempts} attempts
              </p>
              {job.nextRunAt ? (
                <p className="mt-1 text-xs text-muted">Next run: {formatSyncTime(job.nextRunAt)}</p>
              ) : null}
            </li>
          ))
        )}
      </ul>
      <div className="border-t border-border px-4 py-3">
        <Link
          to="/integrations"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Open integration queue
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}
