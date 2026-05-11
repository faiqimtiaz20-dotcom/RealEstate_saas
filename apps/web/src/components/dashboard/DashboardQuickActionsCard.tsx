import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowRight, CalendarClock, GitBranch, Home } from "lucide-react";
import { Link } from "react-router-dom";

const actionClassName =
  "inline-flex items-center justify-between rounded-md border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent";

type Props = {
  canPropertiesWrite: boolean;
  canCrmRead: boolean;
  canCommercialRead: boolean;
};

export function DashboardQuickActionsCard({
  canPropertiesWrite,
  canCrmRead,
  canCommercialRead,
}: Props) {
  const none = !canPropertiesWrite && !canCrmRead && !canCommercialRead;

  return (
    <Card className="border-border/90 shadow-sm">
      <CardHeader className="border-b border-border/80 pb-4">
        <CardTitle className="text-base">Quick actions</CardTitle>
        <CardDescription>Shortcuts your team uses every day.</CardDescription>
      </CardHeader>
      <div className="flex flex-col gap-2 p-4">
        {canPropertiesWrite ? (
          <Link to="/properties/new" className={actionClassName}>
            <span className="flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              New property
            </span>
            <ArrowRight className="h-4 w-4 text-muted" />
          </Link>
        ) : null}
        {canCrmRead ? (
          <Link to="/crm/pipeline" className={actionClassName}>
            <span className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              Open pipeline
            </span>
            <ArrowRight className="h-4 w-4 text-muted" />
          </Link>
        ) : null}
        {canCommercialRead ? (
          <Link to="/commercial/calendar" className={actionClassName}>
            <span className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              Viewings calendar
            </span>
            <ArrowRight className="h-4 w-4 text-muted" />
          </Link>
        ) : null}
        {none ? <p className="text-sm text-muted">No shortcuts for your current role.</p> : null}
      </div>
    </Card>
  );
}
