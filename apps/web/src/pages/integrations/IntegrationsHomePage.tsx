import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { mockChannels } from "@/mocks/integrations";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Probe = { userId: number; title: string };

export function IntegrationsHomePage() {
  const probe = useQuery({
    queryKey: ["integrations-probe"],
    queryFn: async () => {
      const { data } = await api.get<Probe>("https://jsonplaceholder.typicode.com/posts/1");
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
        <p className="text-sm text-muted">
          OLX, Viva Real, and Zap channels — publish/update/remove with a queue and encrypted credentials (API later).
        </p>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Axios + TanStack Query (external probe)</CardTitle>
          <CardDescription>Public GET to validate interceptors — may fail offline.</CardDescription>
        </CardHeader>
        {probe.isLoading ? <Skeleton className="h-10 w-full" /> : null}
        {probe.isError ? (
          <p className="text-sm text-danger">Probe failed — ignore if you are offline.</p>
        ) : null}
        {probe.data ? (
          <p className="text-sm text-muted">
            Post #{probe.data.userId}: <span className="text-foreground">{probe.data.title}</span>
          </p>
        ) : null}
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {mockChannels.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-lg font-semibold">{c.label}</p>
                <p className="text-xs text-muted">
                  Last sync: {c.lastSync ? new Date(c.lastSync).toLocaleString("en-US") : "—"}
                </p>
              </div>
              <Badge
                tone={c.status === "connected" ? "success" : c.status === "error" ? "danger" : "muted"}
              >
                {c.status}
              </Badge>
            </div>
            {c.lastError ? <p className="mt-2 text-sm text-danger">{c.lastError}</p> : null}
            <div className="mt-4 space-y-2">
              <Label>Client ID (masked)</Label>
              <Input defaultValue="••••••••••••abcd" readOnly />
              <Label>Secret</Label>
              <Input type="password" defaultValue="secret" readOnly />
              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => toast.success("Token saved (mock)")}>
                  Save credentials
                </Button>
                <Button type="button" onClick={() => toast.message("Publish (mock)")}>
                  Publish
                </Button>
                <Button type="button" variant="secondary" onClick={() => toast.message("Update (mock)")}>
                  Update
                </Button>
                <Button type="button" variant="ghost" onClick={() => toast.message("Unpublish (mock)")}>
                  Unpublish
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Conflict policy</CardTitle>
          <CardDescription>Source of truth: internal app; portals receive the latest published version.</CardDescription>
        </CardHeader>
        <p className="text-sm text-muted">
          Documented “last write wins” to avoid drift across channels when listings are edited manually on a portal.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/integrations/mapping">
            <Button type="button" variant="secondary">
              Field mapping
            </Button>
          </Link>
          <Link to="/integrations/queue">
            <Button type="button" variant="secondary">
              Job queue
            </Button>
          </Link>
        </div>
      </Card>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Inbound webhooks (portals)</CardTitle>
          <CardDescription>Public endpoint with signature verification in the API.</CardDescription>
        </CardHeader>
        <code className="block rounded-md bg-accent px-3 py-2 text-xs">
          POST https://api.yourdomain.com/webhooks/listings/:channel
        </code>
      </Card>
    </div>
  );
}
