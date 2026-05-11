import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Pagination, slicePage } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { Table, Td, Th } from "@/components/ui/Table";
import { useMockAppStore } from "@/stores/mockAppStore";
import type { LeadSource, LeadStatus } from "@/types/crm";
import { LEAD_SOURCE_LABELS, LEAD_SOURCES, LEAD_STATUS_LABELS } from "@/types/crm";
import { Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const statuses: LeadStatus[] = ["new", "qualified", "proposal", "won", "lost"];

export function LeadsPage() {
  const { can } = useAuth();
  const leads = useMockAppStore((s) => s.leads);
  const [q, setQ] = useState("");
  const [source, setSource] = useState<LeadSource | "all">("all");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const hay = `${l.name} ${l.phone} ${l.email ?? ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (source !== "all" && l.source !== source) return false;
      if (status !== "all" && l.status !== status) return false;
      return true;
    });
  }, [q, source, status, leads]);

  const rows = useMemo(() => slicePage(filtered, page, pageSize), [filtered, page, pageSize]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted">List with filters and pagination (in-browser mock store).</p>
        </div>
        {can("crm.write") ? (
          <Link to="/crm/leads/new">
            <Button type="button">New lead</Button>
          </Link>
        ) : null}
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-muted">Search</label>
            <Input className="mt-1" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Name, phone, email" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Source</label>
            <Select className="mt-1" value={source} onChange={(e) => { setSource(e.target.value as LeadSource | "all"); setPage(1); }}>
              <option value="all">All</option>
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {LEAD_SOURCE_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Stage</label>
            <Select className="mt-1" value={status} onChange={(e) => { setStatus(e.target.value as LeadStatus | "all"); setPage(1); }}>
              <option value="all">All</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {LEAD_STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="No leads found"
          description="Adjust filters or create a new lead."
        />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th>Source</Th>
                <Th>Stage</Th>
                <Th>Tags</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id}>
                  <Td className="font-medium">{l.name}</Td>
                  <Td className="text-muted">{l.phone}</Td>
                  <Td>
                    <Badge tone="primary">{LEAD_SOURCE_LABELS[l.source]}</Badge>
                  </Td>
                  <Td>
                    <Badge tone="muted">{LEAD_STATUS_LABELS[l.status]}</Badge>
                  </Td>
                  <Td className="text-muted">{l.tags.join(", ")}</Td>
                  <Td className="text-right">
                    <Link className="text-sm font-medium text-primary hover:underline" to={`/crm/leads/${l.id}`}>
                      Open
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </>
      )}
    </div>
  );
}
