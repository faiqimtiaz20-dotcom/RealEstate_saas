import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { CalendarEvent } from "@/mocks/commercial";
import { mockCalendarEvents } from "@/mocks/commercial";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const typeLabel = { visit: "Showing", contract: "Contract", renewal: "Renewal" } as const;

const EVENT_BADGE: Record<CalendarEvent["type"], "primary" | "success" | "warning"> = {
  visit: "primary",
  contract: "success",
  renewal: "warning",
};

const WEEKDAYS_MON = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function localDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 42 cells, Monday-first week, `inMonth` marks days outside the viewed month. */
function monthGrid(year: number, month: number): { date: Date; inMonth: boolean }[] {
  const first = new Date(year, month, 1);
  const dow = first.getDay();
  const mondayOffset = dow === 0 ? 6 : dow - 1;
  const gridStart = new Date(year, month, 1 - mondayOffset);
  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push({ date: d, inMonth: d.getMonth() === month });
  }
  return cells;
}

function monthTitle(year: number, month: number) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
}

function isSameLocalDay(a: Date, b: Date) {
  return localDayKey(a) === localDayKey(b);
}

function buildIcs(events: typeof mockCalendarEvents): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PropertyDesk//Mock//EN",
    ...events.flatMap((e) => [
      "BEGIN:VEVENT",
      `UID:${e.id}@propertydesk.local`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${new Date(e.at).toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `SUMMARY:${e.title.replace(/,/g, "\\,")}`,
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

function initialViewMonth(): { year: number; month: number } {
  const times = mockCalendarEvents.map((e) => new Date(e.at).getTime());
  if (!times.length) {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  }
  const d = new Date(Math.min(...times));
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function CommercialCalendarPage() {
  const [{ year, month }, setView] = useState(initialViewMonth);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const eventsByDay = useMemo(() => {
    const m: Record<string, CalendarEvent[]> = {};
    for (const e of mockCalendarEvents) {
      const d = new Date(e.at);
      const key = localDayKey(d);
      (m[key] ??= []).push(e);
    }
    for (const k of Object.keys(m)) {
      m[k].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
    }
    return m;
  }, []);

  const cells = useMemo(() => monthGrid(year, month), [year, month]);
  const today = new Date();
  const selectedEvents = selectedKey ? (eventsByDay[selectedKey] ?? []) : [];

  function shiftMonth(delta: number) {
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
    setSelectedKey(null);
  }

  function goThisMonth() {
    const n = new Date();
    setView({ year: n.getFullYear(), month: n.getMonth() });
    setSelectedKey(localDayKey(n));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Commercial calendar</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Month view for showings and milestones. Drag export for your external calendar (ICS).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5 shadow-sm">
            <Button
              type="button"
              variant="ghost"
              className="h-9 w-9 px-0"
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[10.5rem] px-2 text-center text-sm font-semibold tabular-nums">
              {monthTitle(year, month)}
            </span>
            <Button
              type="button"
              variant="ghost"
              className="h-9 w-9 px-0"
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button type="button" variant="secondary" onClick={goThisMonth}>
            This month
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              const blob = new Blob([buildIcs(mockCalendarEvents)], { type: "text/calendar" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "propertydesk-calendar.ics";
              a.click();
              URL.revokeObjectURL(url);
              toast.success("ICS generated (mock)");
            }}
          >
            Export ICS
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-border/90 p-0 shadow-sm">
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {WEEKDAYS_MON.map((d) => (
            <div
              key={d}
              className="border-r border-border/80 px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted last:border-r-0"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-border">
          {cells.map(({ date, inMonth }) => {
            const key = localDayKey(date);
            const dayEvents = eventsByDay[key] ?? [];
            const isToday = isSameLocalDay(date, today);
            const isSelected = selectedKey === key;
            const showCount = 3;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                className={cn(
                  "flex min-h-[7.5rem] flex-col items-stretch gap-1 bg-card p-1.5 text-left transition sm:min-h-[8.5rem] sm:p-2",
                  !inMonth && "bg-muted/20 text-muted",
                  inMonth && "hover:bg-accent/40",
                  isToday && "ring-2 ring-inset ring-primary/35",
                  isSelected && "bg-primary/6 ring-1 ring-inset ring-primary/40",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                    isToday && "bg-primary text-primary-foreground",
                    !isToday && inMonth && "text-foreground",
                  )}
                >
                  {date.getDate()}
                </span>
                <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
                  {dayEvents.slice(0, showCount).map((ev) => (
                    <span
                      key={ev.id}
                      className="truncate rounded border border-border/80 bg-accent/50 px-1 py-0.5 text-[10px] font-medium leading-tight text-foreground sm:text-[11px]"
                    >
                      <span className="text-muted">
                        {new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(
                          new Date(ev.at),
                        )}{" "}
                      </span>
                      {ev.title}
                    </span>
                  ))}
                  {dayEvents.length > showCount ? (
                    <span className="text-[10px] font-medium text-muted">+{dayEvents.length - showCount} more</span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="border-border/90 shadow-sm">
        <CardHeader className="border-b border-border/80">
          <CardTitle className="text-base">
            {selectedKey
              ? (() => {
                  const [y, mo, d] = selectedKey.split("-").map(Number);
                  return new Intl.DateTimeFormat("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(y, mo - 1, d));
                })()
              : "Select a day"}
          </CardTitle>
          <CardDescription>
            {selectedEvents.length
              ? `${selectedEvents.length} event${selectedEvents.length === 1 ? "" : "s"}`
              : "Click a date on the grid to list its events."}
          </CardDescription>
        </CardHeader>
        <ul className="divide-y divide-border px-4 py-2">
          {selectedEvents.length === 0 ? (
            <li className="py-6 text-center text-sm text-muted">No events on this day.</li>
          ) : (
            selectedEvents.map((ev) => (
              <li key={ev.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{ev.title}</p>
                  <p className="text-xs text-muted">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(ev.at))}
                  </p>
                </div>
                <Badge tone={EVENT_BADGE[ev.type]}>{typeLabel[ev.type]}</Badge>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
