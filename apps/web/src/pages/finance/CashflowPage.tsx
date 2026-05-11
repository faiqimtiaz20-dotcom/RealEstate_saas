import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const series = [
  { day: "01", balance: 110_000 },
  { day: "03", balance: 112_400 },
  { day: "05", balance: 109_900 },
  { day: "07", balance: 115_200 },
  { day: "09", balance: 118_000 },
  { day: "11", balance: 128_400 },
];

export function CashflowPage() {
  const [balance, setBalance] = useState("128400");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cash flow</h1>
        <p className="text-sm text-muted">Daily / weekly / monthly view + manual balance (v1).</p>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:max-w-md">
          <div>
            <Label htmlFor="bal">Cash balance (manual entry)</Label>
            <Input
              id="bal"
              inputMode="decimal"
              className="mt-1"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </div>
          <Button type="button" onClick={() => toast.success("Balance saved (mock)")}>
            Save balance
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Simplified projection</CardTitle>
          <CardDescription>Mock chart — consolidation in the API.</CardDescription>
        </CardHeader>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.52 0.16 255)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="oklch(0.52 0.16 255)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                formatter={(v) => [
                  new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL" }).format(Number(v ?? 0)),
                  "Balance",
                ]}
              />
              <Area type="monotone" dataKey="balance" stroke="oklch(0.52 0.16 255)" fill="url(#cf)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
