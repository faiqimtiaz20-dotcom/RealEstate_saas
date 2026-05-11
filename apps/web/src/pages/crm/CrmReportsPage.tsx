import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useMockAppStore } from "@/stores/mockAppStore";
import { LEAD_SOURCE_LABELS, type LeadSource } from "@/types/crm";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function CrmReportsPage() {
  const [from, setFrom] = useState("2026-05-01");
  const [to, setTo] = useState("2026-05-11");
  const leads = useMockAppStore((s) => s.leads);

  const bySource = useMemo(() => {
    const map = new Map<LeadSource, number>();
    for (const l of leads) map.set(l.source, (map.get(l.source) ?? 0) + 1);
    return [...map.entries()].map(([source, count]) => ({
      name: LEAD_SOURCE_LABELS[source],
      count,
    }));
  }, [leads]);

  const velocity = [
    { week: "W1", days: 5 },
    { week: "W2", days: 4 },
    { week: "W3", days: 6 },
    { week: "W4", days: 3 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CRM reports</h1>
          <p className="text-sm text-muted">Conversion by source and velocity (mock data).</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="text-xs text-muted">
            From
            <input
              type="date"
              className="ml-2 rounded-md border border-border bg-card px-2 py-1 text-sm"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="text-xs text-muted">
            To
            <input
              type="date"
              className="ml-2 rounded-md border border-border bg-card px-2 py-1 text-sm"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Leads by source</CardTitle>
            <CardDescription>
              Range {from} — {to} (UI filter; real aggregation in the API)
            </CardDescription>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySource}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Leads" fill="oklch(0.52 0.16 255)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Average velocity (days)</CardTitle>
            <CardDescription>Lead → qualified (mock)</CardDescription>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="days" name="Days" stroke="oklch(0.52 0.16 255)" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
