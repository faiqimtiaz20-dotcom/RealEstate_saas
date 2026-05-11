import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { chartWindowLabel } from "@/components/dashboard/dashboardFormatters";
import type { LeadsChartRow } from "@/mocks/dashboard";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartPrimary = "oklch(0.52 0.16 255)";
const chartSecondary = "oklch(0.62 0.14 200)";

type Props = {
  loading: boolean;
  chartRows: LeadsChartRow[];
};

export function DashboardLeadsChart({ loading, chartRows }: Props) {
  const windowLabel = chartWindowLabel(chartRows.length);

  return (
    <Card className="border-border/90 shadow-sm lg:col-span-8">
      <CardHeader className="border-b border-border/80 pb-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg">Leads &amp; tours</CardTitle>
            <CardDescription>Monthly volume — compare inquiries with scheduled tours.</CardDescription>
          </div>
          <Badge tone="muted" className="w-fit font-normal">
            {windowLabel}
          </Badge>
        </div>
      </CardHeader>
      <div className="h-72 px-2 py-4 sm:h-80">
        {loading ? (
          <Skeleton className="h-full w-full rounded-md" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={36} />
              <Tooltip
                contentStyle={{
                  borderRadius: "0.5rem",
                  border: "1px solid oklch(0.91 0.01 255)",
                  boxShadow: "0 4px 12px oklch(0 0 0 / 0.06)",
                }}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
              />
              <Legend wrapperStyle={{ paddingTop: 16 }} />
              <Bar dataKey="leads" name="Leads" fill={chartPrimary} radius={[6, 6, 0, 0]} maxBarSize={40} />
              <Line
                type="monotone"
                dataKey="tours"
                name="Tours"
                stroke={chartSecondary}
                strokeWidth={2.5}
                dot={{ r: 3, fill: chartSecondary }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
