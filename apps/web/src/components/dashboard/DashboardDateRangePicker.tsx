import { cn } from "@/lib/cn";
import { DASHBOARD_RANGE_OPTIONS, type DashboardDateRangeKey } from "@/mocks/dashboard";

type Props = {
  value: DashboardDateRangeKey;
  onChange: (next: DashboardDateRangeKey) => void;
};

export function DashboardDateRangePicker({ value, onChange }: Props) {
  return (
    <div
      className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1 shadow-sm"
      role="group"
      aria-label="Dashboard date range"
    >
      {DASHBOARD_RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            value === opt.key
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted hover:bg-accent hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
