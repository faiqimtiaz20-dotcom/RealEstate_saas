import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useMockAppStore } from "@/stores/mockAppStore";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const links = [
  { to: "/settings/org", title: "Organization", desc: "Agency, branches, and team." },
  { to: "/settings/audit", title: "Audit log", desc: "Listings, finance, integration tokens." },
  { to: "/settings/webhooks", title: "Outbound webhooks", desc: "Events to Zapier / external systems." },
  { to: "/settings/custom-fields", title: "Custom fields", desc: "JSON schema per entity." },
];

export function SettingsHomePage() {
  const resetMockData = useMockAppStore((s) => s.resetMockData);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted">Tenant preferences and governance.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="block">
            <Card className="h-full p-4 transition hover:border-primary/40">
              <CardHeader className="px-0 pt-0">
                <CardTitle>{l.title}</CardTitle>
                <CardDescription>{l.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-danger/30 bg-danger/5 p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-base">Demo data</CardTitle>
          <CardDescription>
            Restore leads, properties, contacts, transactions, and accounts to the initial seed (UI-only mock store).
          </CardDescription>
        </CardHeader>
        <Button
          type="button"
          variant="danger"
          onClick={() => {
            resetMockData();
            toast.success("Mock store reset");
          }}
        >
          Reset mock store
        </Button>
      </Card>
    </div>
  );
}
