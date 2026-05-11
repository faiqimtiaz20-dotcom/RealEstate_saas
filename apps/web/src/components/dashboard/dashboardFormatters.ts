import type { ListingChannelState } from "@/mocks/integrations";

export function formatRelativeShort(iso: string) {
  const d = new Date(iso).getTime();
  const diffMs = Date.now() - d;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 36) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function formatSyncTime(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

export const moneyCompact = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

export function channelBadgeTone(status: ListingChannelState["status"]) {
  if (status === "connected") return "success" as const;
  if (status === "error") return "danger" as const;
  return "muted" as const;
}

export function chartWindowLabel(pointCount: number) {
  if (pointCount <= 1) return "Current period";
  if (pointCount <= 3) return `Last ${pointCount} months`;
  if (pointCount <= 6) return `Last ${pointCount} months`;
  return "Last 7 months";
}
