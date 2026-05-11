import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, Td, Th } from "@/components/ui/Table";
import { cn } from "@/lib/cn";
import { useMockAppStore } from "@/stores/mockAppStore";
import {
  ArrowLeft,
  Bath,
  Bed,
  CarFront,
  ChevronDown,
  ChevronUp,
  FileText,
  History,
  MapPin,
  Maximize2,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const money = (n: number | null) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

function SpecPill({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm shadow-sm">
      <Icon className="h-4 w-4 text-primary" aria-hidden />
      <span className="font-medium text-foreground">{label}</span>
    </div>
  );
}

export function PropertyDetailPage() {
  const { id } = useParams();
  const { can } = useAuth();
  const properties = useMockAppStore((s) => s.properties);
  const property = useMemo(() => properties.find((p) => p.id === id), [id, properties]);
  const [order, setOrder] = useState<string[] | null>(null);
  const [featuredIdx, setFeaturedIdx] = useState(0);

  const photos = order ?? property?.gallery ?? [];

  useEffect(() => {
    setOrder(null);
    setFeaturedIdx(0);
  }, [property?.id]);

  useEffect(() => {
    setFeaturedIdx((i) => Math.min(i, Math.max(0, photos.length - 1)));
  }, [photos.length]);

  if (!property) {
    return (
      <EmptyState
        title="Property not found"
        action={
          <Link to="/properties">
            <Button type="button">Back</Button>
          </Link>
        }
      />
    );
  }

  const featured = photos[featuredIdx] ?? property.coverImage;
  const canWrite = can("properties.write");

  function movePhoto(idx: number, dir: -1 | 1) {
    const list = [...photos];
    const next = idx + dir;
    if (next < 0 || next >= list.length) return;
    [list[idx], list[next]] = [list[next], list[idx]];
    setOrder(list);
    if (featuredIdx === idx) setFeaturedIdx(next);
    else if (featuredIdx === next) setFeaturedIdx(idx);
    toast.success("Order updated (mock)");
  }

  return (
    <div className="space-y-8 pb-8">
      <Link
        to="/properties"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All properties
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {property.title}
            </h1>
            <Badge
              tone={property.status === "published" ? "success" : "warning"}
              className="shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide"
            >
              {property.status === "published" ? "Published" : "Draft"}
            </Badge>
          </div>
          <p className="flex items-start gap-2 text-base text-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" aria-hidden />
            <span>
              {property.address}
              <span className="text-muted"> · </span>
              {property.city}, {property.state}
            </span>
          </p>
          <p className="font-mono text-xs text-muted/90">
            <span className="text-muted">Slug </span>
            {property.slug}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {canWrite ? (
            <Link to={`/properties/${property.id}/edit`}>
              <Button type="button" className="gap-2 shadow-sm">
                <Pencil className="h-4 w-4" aria-hidden />
                Edit
              </Button>
            </Link>
          ) : null}
          <Link to="/properties">
            <Button type="button" variant="secondary" className="shadow-sm">
              Back to list
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <SpecPill icon={Bed} label={`${property.bedrooms} bed${property.bedrooms === 1 ? "" : "s"}`} />
        <SpecPill icon={Bath} label={`${property.bathrooms} bath${property.bathrooms === 1 ? "" : "s"}`} />
        <SpecPill icon={Maximize2} label={`${property.areaM2} m²`} />
        <SpecPill icon={CarFront} label={`${property.parking} parking`} />
        <SpecPill icon={Maximize2} label={property.type.replace("_", " ")} />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md ring-1 ring-black/[0.04] dark:ring-white/10">
            <div className="relative aspect-[16/10] max-h-[min(52vh,520px)] w-full bg-muted">
              <img
                src={featured}
                alt=""
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>
            {photos.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto p-3">
                {photos.map((src, idx) => (
                  <div
                    key={`${src}-${idx}`}
                    className={cn(
                      "group relative shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                      idx === featuredIdx
                        ? "border-primary shadow-md ring-2 ring-primary/20"
                        : "border-transparent opacity-80 hover:opacity-100",
                    )}
                  >
                    <button
                      type="button"
                      className="relative block h-16 w-24 sm:h-20 sm:w-32"
                      onClick={() => setFeaturedIdx(idx)}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                    {canWrite ? (
                      <div className="absolute right-1 top-1 flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          type="button"
                          variant="secondary"
                          className="h-7 w-7 bg-card/95 p-0 shadow-sm backdrop-blur-sm"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            movePhoto(idx, -1);
                          }}
                          aria-label="Move earlier"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          className="h-7 w-7 bg-card/95 p-0 shadow-sm backdrop-blur-sm"
                          disabled={idx === photos.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            movePhoto(idx, 1);
                          }}
                          aria-label="Move later"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/80 p-5 shadow-sm">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" aria-hidden />
                  </div>
                  <div>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Visibility (internal / broker).</CardDescription>
                  </div>
                </div>
              </CardHeader>
              {property.documents.length === 0 ? (
                <p className="text-sm text-muted">No documents attached.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {property.documents.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/50 px-3 py-2.5 text-sm transition-colors hover:border-border hover:bg-accent/30"
                    >
                      <span className="min-w-0 truncate font-medium">{d.name}</span>
                      <Badge tone={d.visibility === "internal" ? "warning" : "primary"} className="shrink-0 capitalize">
                        {d.visibility}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="border-border/80 p-5 shadow-sm">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <History className="h-4 w-4" aria-hidden />
                  </div>
                  <div>
                    <CardTitle>Change history</CardTitle>
                    <CardDescription>Price and status (M4 versioning).</CardDescription>
                  </div>
                </div>
              </CardHeader>
              {property.history.length === 0 ? (
                <p className="text-sm text-muted">No changes recorded.</p>
              ) : (
                <div className="mt-2 overflow-x-auto rounded-xl border border-border/60">
                  <Table>
                    <thead>
                      <tr className="bg-accent/40">
                        <Th>When</Th>
                        <Th>Field</Th>
                        <Th>From</Th>
                        <Th>To</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.history.map((h, i) => (
                        <tr key={i}>
                          <Td className="whitespace-nowrap text-muted">{new Date(h.at).toLocaleString("en-US")}</Td>
                          <Td className="font-mono text-xs">{h.field}</Td>
                          <Td>{h.from}</Td>
                          <Td>{h.to}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="space-y-4 lg:sticky lg:top-4">
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card to-accent/30 p-1 shadow-md ring-1 ring-black/[0.04] dark:ring-white/10">
              <div className="rounded-[calc(1rem-2px)] bg-card/80 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Pricing</p>
                <div className="mt-4 grid gap-3">
                  {property.priceSale != null ? (
                    <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                      <p className="text-xs font-medium text-muted">Sale</p>
                      <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{money(property.priceSale)}</p>
                    </div>
                  ) : null}
                  {property.priceRent != null ? (
                    <div className="rounded-xl border border-border/60 bg-background/80 p-4">
                      <p className="text-xs font-medium text-muted">Rent / month</p>
                      <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{money(property.priceRent)}</p>
                    </div>
                  ) : null}
                  {property.priceSale == null && property.priceRent == null ? (
                    <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
                      No list prices set
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <Card className="border-border/80 p-5 shadow-sm">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-base">Property details</CardTitle>
                <CardDescription>For portals and contracts.</CardDescription>
              </CardHeader>
              <dl className="divide-y divide-border/60">
                {[
                  { label: "Address", value: property.address },
                  { label: "City", value: `${property.city}, ${property.state}` },
                  { label: "Type", value: <span className="capitalize">{property.type.replace("_", " ")}</span> },
                  { label: "Area", value: `${property.areaM2} m²` },
                  { label: "Annual IPTU", value: property.iptuAnnual != null ? money(property.iptuAnnual) : "—" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 py-3 text-sm first:pt-0 last:pb-0">
                    <dt className="shrink-0 text-muted">{row.label}</dt>
                    <dd className="text-right font-medium text-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
