import { api } from "@/lib/api";
import {
  fetchDashboardData,
  type DashboardData,
  type DashboardDateRangeKey,
} from "@/mocks/dashboard";

export type { DashboardData, DashboardDateRangeKey } from "@/mocks/dashboard";

/**
 * Dashboard snapshot for the UI. When `VITE_DASHBOARD_LIVE_API=true`, calls the backend;
 * otherwise uses the in-repo mock (same delay + shape for easy bring-up).
 *
 * Expected live route: `GET /v1/dashboard/summary?range=7d|30d|90d|12m` → JSON matching `DashboardData`.
 */
export async function getDashboardSnapshot(range: DashboardDateRangeKey): Promise<DashboardData> {
  const live = import.meta.env.VITE_DASHBOARD_LIVE_API === "true";
  if (live) {
    try {
      const { data } = await api.get<DashboardData>("/v1/dashboard/summary", {
        params: { range },
        timeout: 12_000,
      });
      return data;
    } catch {
      // API not ready or unreachable — keep the product usable in dev.
    }
  }
  return fetchDashboardData(range);
}
