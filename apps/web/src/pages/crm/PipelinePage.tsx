import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { useMockAppStore } from "@/stores/mockAppStore";
import type { Lead, LeadStatus } from "@/types/crm";
import { LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS } from "@/types/crm";
import { MoreHorizontal, Phone, Plus } from "lucide-react";
import { useMemo, useState, type DragEvent } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const columns: LeadStatus[] = ["new", "qualified", "proposal", "won", "lost"];

const DRAG_MIME = "application/x-re-lead-id";

const columnAccent: Record<LeadStatus, string> = {
  new: "border-t-sky-500",
  qualified: "border-t-indigo-500",
  proposal: "border-t-amber-500",
  won: "border-t-emerald-600",
  lost: "border-t-neutral-400",
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function shortDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
}

function PipelineLeadCard({
  lead,
  column,
  canDrag,
  isDragging,
  dragActive,
  onDragStart,
  onDragEnd,
  onColumnDragOver,
  onColumnDrop,
}: {
  lead: Lead;
  column: LeadStatus;
  canDrag: boolean;
  isDragging: boolean;
  dragActive: boolean;
  onDragStart: (e: DragEvent<HTMLElement>, leadId: string) => void;
  onDragEnd: () => void;
  onColumnDragOver: (e: DragEvent<HTMLElement>, col: LeadStatus) => void;
  onColumnDrop: (e: DragEvent<HTMLElement>, col: LeadStatus) => void;
}) {
  return (
    <article
      draggable={canDrag}
      onDragStart={(e) => {
        if (!canDrag) return;
        onDragStart(e, lead.id);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        if (!dragActive) return;
        onColumnDragOver(e, column);
      }}
      onDrop={(e) => {
        if (!dragActive) return;
        e.stopPropagation();
        onColumnDrop(e, column);
      }}
      className={cn(
        "group rounded-lg border border-border bg-card p-3 shadow-sm ring-1 ring-transparent transition-all",
        canDrag && "cursor-grab active:cursor-grabbing",
        !canDrag && "cursor-default",
        "hover:border-primary/25 hover:shadow-md hover:ring-primary/10",
        isDragging && "opacity-40 ring-2 ring-primary/30",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
          aria-hidden
        >
          {initials(lead.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/crm/leads/${lead.id}`}
              draggable={false}
              className="line-clamp-2 text-sm font-semibold leading-snug text-foreground hover:text-primary hover:underline"
            >
              {lead.name}
            </Link>
            <Link
              to={`/crm/leads/${lead.id}`}
              draggable={false}
              className="shrink-0 rounded p-0.5 text-muted opacity-0 transition hover:bg-accent hover:text-foreground group-hover:opacity-100"
              aria-label="Open lead"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge tone="muted" className="max-w-[10rem] truncate font-normal">
              {LEAD_SOURCE_LABELS[lead.source]}
            </Badge>
            <span className="text-[11px] text-muted">{shortDate(lead.createdAt)}</span>
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 truncate text-xs text-muted">
            <Phone className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
            <span className="truncate">{lead.phone}</span>
          </p>
          {lead.tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {lead.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted"
                >
                  {t}
                </span>
              ))}
              {lead.tags.length > 3 ? (
                <span className="text-[10px] font-medium text-muted">+{lead.tags.length - 3}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function PipelinePage() {
  const { can } = useAuth();
  const leads = useMockAppStore((s) => s.leads);
  const updateLead = useMockAppStore((s) => s.updateLead);

  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);

  const grouped = useMemo(() => {
    const map: Record<LeadStatus, Lead[]> = {
      new: [],
      qualified: [],
      proposal: [],
      won: [],
      lost: [],
    };
    for (const l of leads) map[l.status].push(l);
    return map;
  }, [leads]);

  function move(leadId: string, from: LeadStatus, to: LeadStatus) {
    updateLead(leadId, { status: to });
    toast.success(`${LEAD_STATUS_LABELS[from]} → ${LEAD_STATUS_LABELS[to]} (mock)`);
  }

  function handleDragStart(e: DragEvent<HTMLElement>, leadId: string) {
    e.dataTransfer.setData(DRAG_MIME, leadId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingLeadId(leadId);
  }

  function handleDragEnd() {
    setDraggingLeadId(null);
    setDragOverColumn(null);
  }

  function handleColumnDragOver(e: DragEvent<HTMLElement>, col: LeadStatus) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(col);
  }

  function handleColumnDragLeave(e: DragEvent<HTMLElement>, col: LeadStatus) {
    const next = e.relatedTarget;
    if (next instanceof Node && e.currentTarget.contains(next)) return;
    setDragOverColumn((prev) => (prev === col ? null : prev));
  }

  function handleColumnDrop(e: DragEvent<HTMLElement>, col: LeadStatus) {
    e.preventDefault();
    const id = e.dataTransfer.getData(DRAG_MIME);
    setDragOverColumn(null);
    setDraggingLeadId(null);
    if (!id) return;
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.status === col) return;
    move(id, lead.status, col);
  }

  const canDrag = can("crm.write");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Pipeline</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Kanban by lead stage — <span className="font-medium text-foreground">drag a card</span> into another
            column to update the stage{canDrag ? "." : " (view only)."}
          </p>
        </div>
        {can("crm.write") ? (
          <Link
            to="/crm/leads/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent sm:self-auto"
          >
            <Plus className="h-4 w-4 text-primary" />
            New lead
          </Link>
        ) : null}
      </div>

      <div className="min-h-0 flex-1">
        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
          {columns.map((col) => (
            <section
              key={col}
              className={cn(
                "flex w-[min(100%,300px)] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-muted/15 shadow-sm",
                "border-t-4",
                columnAccent[col],
              )}
            >
              <header className="flex items-center justify-between gap-2 border-b border-border/80 bg-card/60 px-3 py-2.5 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-foreground">{LEAD_STATUS_LABELS[col]}</h2>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-muted tabular-nums">
                  {grouped[col].length}
                </span>
              </header>
              <div
                className={cn(
                  "flex max-h-[calc(100dvh-12rem)] min-h-[12rem] flex-1 flex-col gap-2 overflow-y-auto p-2 transition-colors sm:max-h-[calc(100dvh-10rem)]",
                  dragOverColumn === col && draggingLeadId && "bg-primary/8 ring-2 ring-inset ring-primary/25",
                )}
                onDragOver={(e) => handleColumnDragOver(e, col)}
                onDragLeave={(e) => handleColumnDragLeave(e, col)}
                onDrop={(e) => handleColumnDrop(e, col)}
              >
                {grouped[col].length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-card/30 px-3 py-8 text-center">
                    <p className="text-xs font-medium text-muted">No leads</p>
                    <p className="mt-1 text-[11px] text-muted">Drop a card here</p>
                  </div>
                ) : (
                  grouped[col].map((l) => (
                    <PipelineLeadCard
                      key={l.id}
                      lead={l}
                      column={col}
                      canDrag={canDrag}
                      isDragging={draggingLeadId === l.id}
                      dragActive={draggingLeadId !== null}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onColumnDragOver={handleColumnDragOver}
                      onColumnDrop={handleColumnDrop}
                    />
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
