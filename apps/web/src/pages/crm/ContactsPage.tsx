import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Pagination, slicePage } from "@/components/ui/Pagination";
import { Table, Td, Th } from "@/components/ui/Table";
import { useMockAppStore } from "@/stores/mockAppStore";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export function ContactsPage() {
  const contacts = useMockAppStore((s) => s.contacts);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    if (!s) return contacts;
    return contacts.filter((c) => `${c.name} ${c.email ?? ""} ${c.phone}`.toLowerCase().includes(s));
  }, [q, contacts]);

  const rows = useMemo(() => slicePage(filtered, page, pageSize), [filtered, page, pageSize]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted">Unified directory with editable detail (mock store).</p>
        </div>
        <Link to="/crm/contacts/new">
          <Button type="button">New contact</Button>
        </Link>
      </div>
      <Card className="p-4">
        <label className="text-xs font-medium text-muted">Search</label>
        <Input
          className="mt-1 max-w-md"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Name, email, phone"
        />
      </Card>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Tags</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <Td className="font-medium">{c.name}</Td>
              <Td className="text-muted">{c.email ?? "—"}</Td>
              <Td className="text-muted">{c.phone}</Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  {c.tags.map((t) => (
                    <Badge key={t} tone="primary">
                      {t}
                    </Badge>
                  ))}
                </div>
              </Td>
              <Td className="text-right">
                <Link className="text-sm font-medium text-primary hover:underline" to={`/crm/contacts/${c.id}`}>
                  Open
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
