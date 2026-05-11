import { Badge } from "@/components/ui/Badge";

export function TrendBadge({ pct }: { pct: number }) {
  const good = pct >= 0;
  const tone = good ? "success" : "danger";
  const sign = pct > 0 ? "+" : "";
  return (
    <Badge tone={tone} className="shrink-0 tabular-nums">
      {sign}
      {pct.toFixed(1)}%
    </Badge>
  );
}
