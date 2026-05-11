import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Pagination, slicePage } from "@/components/ui/Pagination";
import { useMockAppStore } from "@/stores/mockAppStore";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const money = (n: number | null) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

export function PropertiesPage() {
  const { can } = useAuth();
  const properties = useMockAppStore((s) => s.properties);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    if (!s) return properties;
    return properties.filter((p) => `${p.title} ${p.city} ${p.address}`.toLowerCase().includes(s));
  }, [q, properties]);

  const rows = useMemo(() => slicePage(filtered, page, pageSize), [filtered, page, pageSize]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Properties</h1>
          <p className="text-sm text-muted">Visual CRUD with mock store (create/edit without API).</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input className="max-w-md" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search title, city, or address" />
          {can("properties.write") ? (
            <Link to="/properties/new">
              <Button type="button">New property</Button>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((p) => (
          <Card key={p.id} className="overflow-hidden p-0">
            <div className="aspect-[16/10] w-full overflow-hidden">
              <img src={p.coverImage} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold leading-snug">{p.title}</h2>
                <Badge tone={p.status === "published" ? "success" : "warning"}>
                  {p.status === "published" ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="text-sm text-muted">
                {p.address} — {p.city}/{p.state}
              </p>
              <p className="text-sm">
                Sale: <span className="font-medium">{money(p.priceSale)}</span> · Rent:{" "}
                <span className="font-medium">{money(p.priceRent)}</span>
              </p>
              <p className="text-xs text-muted">
                {p.bedrooms} bd · {p.bathrooms} ba · {p.areaM2} m² · {p.parking} pkg
              </p>
              <div className="flex flex-wrap gap-3 text-sm font-medium">
                <Link className="text-primary hover:underline" to={`/properties/${p.id}`}>
                  Open listing
                </Link>
                {can("properties.write") ? (
                  <Link className="text-primary hover:underline" to={`/properties/${p.id}/edit`}>
                    Edit
                  </Link>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
