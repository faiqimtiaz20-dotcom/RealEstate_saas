import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";

const events = [
  "lead.created",
  "lead.updated",
  "deal.stage_changed",
  "property.published",
  "integration.job_failed",
];

export function WebhooksPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Webhooks outbound</h1>
        <p className="text-sm text-muted">HMAC signature + retries — disabled until the API exists.</p>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:max-w-xl">
          <div>
            <Label htmlFor="url">Destination URL</Label>
            <Input id="url" className="mt-1" placeholder="https://hooks.your-system.com/re" disabled />
          </div>
          <div>
            <Label>Events</Label>
            <ul className="mt-2 space-y-2">
              {events.map((e) => (
                <li key={e} className="flex items-center gap-2 text-sm text-muted">
                  <input type="checkbox" disabled />
                  <code className="rounded bg-accent px-1">{e}</code>
                </li>
              ))}
            </ul>
          </div>
          <Button type="button" disabled onClick={() => toast.message("Save")}>
            Save (requires API)
          </Button>
        </div>
        <CardHeader className="mt-4 px-0 pb-0 pt-4">
          <CardTitle className="text-base">Security</CardTitle>
          <CardDescription>Signature header and secret rotation in the API.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
