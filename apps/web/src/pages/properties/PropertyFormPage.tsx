import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/cn";
import { ImageDropZone } from "@/pages/properties/ImageDropZone";
import {
  parseOptionalMoney,
  PROPERTY_TYPE_LABELS,
  propertyFormSchema,
  propertyToFormValues,
  propertyTypes,
  type PropertyFormValues,
} from "@/pages/properties/propertyFormSchema";
import type { NewPropertyInput } from "@/stores/mockAppStore";
import { useMockAppStore } from "@/stores/mockAppStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Bath,
  Bed,
  Building2,
  CarFront,
  DollarSign,
  Home,
  ImageIcon,
  MapPin,
  Maximize2,
  Pencil,
  Plus,
  Store,
  Tag,
  Trees,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const defaultCover = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80";

const money = (n: number | null) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

function isImageSrc(s: string) {
  return /^https?:\/\//i.test(s) || s.startsWith("data:image/");
}

function firstPreviewImage(cover: string | undefined, gallery: string | undefined): string | null {
  const c = cover?.trim();
  if (c && isImageSrc(c)) return c;
  const line = gallery
    ?.split("\n")
    .map((s) => s.trim())
    .find((s) => isImageSrc(s));
  return line ?? null;
}

function splitGalleryLines(s: string | undefined) {
  return (s ?? "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function joinGalleryLines(lines: string[]) {
  return lines.join("\n");
}

const typeIcons: Record<(typeof propertyTypes)[number], LucideIcon> = {
  apartment: Building2,
  house: Home,
  commercial: Store,
  land: Trees,
};

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-border/80 p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </div>
      </div>
      {children}
    </Card>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-danger">{message}</p>;
}

export function PropertyFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isCreate = location.pathname.endsWith("/new");

  const properties = useMockAppStore((s) => s.properties);
  const addProperty = useMockAppStore((s) => s.addProperty);
  const updateProperty = useMockAppStore((s) => s.updateProperty);

  const existing = useMemo(() => {
    if (isCreate || !id) return null;
    return properties.find((p) => p.id === id) ?? null;
  }, [id, isCreate, properties]);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      address: "",
      city: "",
      state: "SP",
      type: "apartment",
      areaM2: 80,
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      priceSale: "",
      priceRent: "",
      iptuAnnual: "",
      status: "draft",
      coverImage: "",
      galleryLines: "",
    },
  });

  const watched = useWatch({ control: form.control });

  useEffect(() => {
    if (!isCreate && existing) {
      form.reset(propertyToFormValues(existing));
    }
  }, [existing, form, isCreate]);

  if (!isCreate && id && !existing) {
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

  const galleryUrls = useMemo(() => splitGalleryLines(watched.galleryLines), [watched.galleryLines]);
  const coverTrim = watched.coverImage?.trim() ?? "";
  const coverPreview = coverTrim && isImageSrc(coverTrim) ? coverTrim : null;
  const previewImg = firstPreviewImage(watched.coverImage, watched.galleryLines) ?? defaultCover;
  const previewTitle = watched.title?.trim() || "Untitled listing";
  const previewLocation = [watched.address, watched.city].filter(Boolean).join(" · ") || "Address not set yet";
  const typeKey = watched.type ?? "apartment";
  const TypeIcon = typeIcons[typeKey] ?? Building2;
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : "—");

  const onSubmit = form.handleSubmit((values) => {
    const payload: NewPropertyInput = {
      title: values.title,
      address: values.address,
      city: values.city,
      state: values.state.toUpperCase(),
      type: values.type,
      areaM2: values.areaM2,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      parking: values.parking,
      priceSale: parseOptionalMoney(values.priceSale),
      priceRent: parseOptionalMoney(values.priceRent),
      status: values.status,
      coverImage: values.coverImage?.trim() || defaultCover,
      galleryLines: values.galleryLines ?? "",
      iptuAnnual: parseOptionalMoney(values.iptuAnnual),
    };

    if (isCreate) {
      const newId = addProperty(payload);
      toast.success("Property created (mock)");
      navigate(`/properties/${newId}`);
      return;
    }
    if (!id) return;
    updateProperty(id, payload);
    toast.success("Property updated (mock)");
    navigate(`/properties/${id}`);
  });

  const err = form.formState.errors;

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      <Link
        to="/properties"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All properties
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {isCreate ? "New property" : "Edit property"}
            </h1>
            {!isCreate ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent/50 px-3 py-1 text-xs font-medium text-muted">
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                Editing
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Plus className="h-3.5 w-3.5" aria-hidden />
                Create
              </span>
            )}
          </div>
          <p className="max-w-2xl text-sm text-muted sm:text-base">
            {isCreate
              ? "Add a listing with specs and media. Everything saves to the in-browser mock store until the API is wired."
              : "Update listing details. Changes apply to the mock store only."}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <form id="property-form" className="space-y-6" onSubmit={onSubmit} noValidate>
            <FormSection icon={Tag} title="Basics" description="Title and location shown on listings and contracts.">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" className="mt-1" placeholder="e.g. Penthouse open view — Paulista" {...form.register("title")} />
                  <FieldError message={err.title?.message} />
                </div>
                <div>
                  <Label htmlFor="address">Street address</Label>
                  <Input id="address" className="mt-1" placeholder="Street, number, neighborhood" {...form.register("address")} />
                  <FieldError message={err.address?.message} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" className="mt-1" placeholder="São Paulo" {...form.register("city")} />
                    <FieldError message={err.city?.message} />
                  </div>
                  <div>
                    <Label htmlFor="state">State (2 letters)</Label>
                    <Input id="state" className="mt-1 uppercase" maxLength={2} placeholder="SP" {...form.register("state")} />
                    <FieldError message={err.state?.message} />
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection icon={Building2} title="Classification" description="Property type and publication status.">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select id="type" className="mt-1" {...form.register("type")}>
                    {propertyTypes.map((t) => (
                      <option key={t} value={t}>
                        {PROPERTY_TYPE_LABELS[t]}
                      </option>
                    ))}
                  </Select>
                  <FieldError message={err.type?.message} />
                </div>
                <div>
                  <Label>Status</Label>
                  <input type="hidden" {...form.register("status")} />
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(
                      [
                        { value: "draft" as const, label: "Draft", hint: "Not public" },
                        { value: "published" as const, label: "Published", hint: "Visible" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => form.setValue("status", opt.value, { shouldDirty: true })}
                        className={cn(
                          "rounded-xl border px-3 py-3 text-left text-sm font-medium transition-all",
                          (watched.status ?? "draft") === opt.value
                            ? "border-primary bg-primary/10 text-foreground shadow-sm ring-2 ring-primary/20"
                            : "border-border bg-card text-muted hover:border-border hover:bg-accent/40",
                        )}
                      >
                        <span className="block">{opt.label}</span>
                        <span className="mt-0.5 block text-xs font-normal text-muted">{opt.hint}</span>
                      </button>
                    ))}
                  </div>
                  <FieldError message={err.status?.message} />
                </div>
              </div>
            </FormSection>

            <FormSection icon={Maximize2} title="Specs" description="Size and layout — used for search and portals.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="areaM2">Area (m²)</Label>
                  <Input id="areaM2" type="number" min={1} step={1} className="mt-1" {...form.register("areaM2", { valueAsNumber: true })} />
                  <FieldError message={err.areaM2?.message} />
                </div>
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" type="number" min={0} step={1} className="mt-1" {...form.register("bedrooms", { valueAsNumber: true })} />
                  <FieldError message={err.bedrooms?.message} />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min={0}
                    step={1}
                    className="mt-1"
                    {...form.register("bathrooms", { valueAsNumber: true })}
                  />
                  <FieldError message={err.bathrooms?.message} />
                </div>
                <div>
                  <Label htmlFor="parking">Parking spaces</Label>
                  <Input id="parking" type="number" min={0} step={1} className="mt-1" {...form.register("parking", { valueAsNumber: true })} />
                  <FieldError message={err.parking?.message} />
                </div>
              </div>
            </FormSection>

            <FormSection icon={DollarSign} title="Pricing" description="Optional amounts in BRL (numbers only or decimals).">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="priceSale">Sale price</Label>
                  <Input id="priceSale" inputMode="decimal" className="mt-1" placeholder="3250000" {...form.register("priceSale")} />
                  <FieldError message={err.priceSale?.message} />
                </div>
                <div>
                  <Label htmlFor="priceRent">Rent / month</Label>
                  <Input id="priceRent" inputMode="decimal" className="mt-1" placeholder="4200" {...form.register("priceRent")} />
                  <FieldError message={err.priceRent?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="iptuAnnual">Annual IPTU</Label>
                  <Input id="iptuAnnual" inputMode="decimal" className="mt-1" placeholder="9200" {...form.register("iptuAnnual")} />
                  <FieldError message={err.iptuAnnual?.message} />
                </div>
              </div>
            </FormSection>

            <FormSection
              icon={ImageIcon}
              title="Media"
              description="Upload images (saved in-browser as data URLs for this mock) or paste external image URLs."
            >
              <div className="grid gap-8">
                <div className="space-y-4">
                  <ImageDropZone
                    id="property-cover-upload"
                    label="Cover image"
                    description="Drag & drop or click to set the main listing photo."
                    previewSrc={coverPreview}
                    previewAlt="Cover preview"
                    onReady={(urls) => {
                      const u = urls[0];
                      if (u) form.setValue("coverImage", u, { shouldDirty: true, shouldValidate: true });
                    }}
                    onClear={() => form.setValue("coverImage", "", { shouldDirty: true, shouldValidate: true })}
                  />
                  <div>
                    <Label htmlFor="coverImage">Or paste cover URL</Label>
                    <Input
                      id="coverImage"
                      className="mt-1 font-mono text-xs"
                      placeholder={defaultCover}
                      {...form.register("coverImage")}
                    />
                    <p className="mt-1 text-xs text-muted">Leave blank to use the default stock image or the first gallery image.</p>
                    <FieldError message={err.coverImage?.message} />
                  </div>
                </div>

                <div className="space-y-4 border-t border-border pt-6">
                  <div>
                    <p className="text-sm font-medium text-foreground">Gallery</p>
                    <p className="mt-0.5 text-xs text-muted">Add more photos below, or paste one HTTPS / data URL per line.</p>
                  </div>
                  {galleryUrls.length > 0 ? (
                    <ul className="flex flex-wrap gap-2" aria-label="Gallery thumbnails">
                      {galleryUrls.map((url, index) => (
                        <li
                          key={`${index}-${url.slice(0, 48)}`}
                          className="group relative h-24 w-32 overflow-hidden rounded-lg border border-border bg-muted shadow-sm"
                        >
                          {isImageSrc(url) ? (
                            <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
                          ) : (
                            <div className="flex h-full items-center justify-center p-1 text-center text-[10px] text-muted">URL</div>
                          )}
                          <Button
                            type="button"
                            variant="secondary"
                            className="absolute right-1 top-1 h-7 w-7 bg-card/95 p-0 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100"
                            aria-label={`Remove image ${index + 1}`}
                            onClick={() => {
                              const next = galleryUrls.filter((_, j) => j !== index);
                              form.setValue("galleryLines", joinGalleryLines(next), { shouldDirty: true, shouldValidate: true });
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <ImageDropZone
                    id="property-gallery-upload"
                    label="Upload gallery images"
                    description="You can select several files at once."
                    previewSrc={null}
                    multiple
                    onReady={(urls) => {
                      const cur = splitGalleryLines(form.getValues("galleryLines"));
                      form.setValue("galleryLines", joinGalleryLines([...cur, ...urls]), {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                  <div>
                    <Label htmlFor="galleryLines">Gallery URLs (one per line)</Label>
                    <Textarea
                      id="galleryLines"
                      className="mt-1 min-h-[100px] font-mono text-xs leading-relaxed"
                      rows={4}
                      placeholder={"https://…\nhttps://…"}
                      {...form.register("galleryLines")}
                    />
                    <FieldError message={err.galleryLines?.message} />
                  </div>
                </div>
              </div>
            </FormSection>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Link to="/properties" className="sm:mr-auto">
                <Button type="button" variant="secondary" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="w-full shadow-sm sm:w-auto sm:min-w-[160px]">
                {isCreate ? "Create property" : "Save changes"}
              </Button>
            </div>
          </form>
        </div>

        <aside className="lg:col-span-5">
          <div className="space-y-4 lg:sticky lg:top-4">
            <Card className="overflow-hidden border-border/80 shadow-md ring-1 ring-black/[0.04]">
              <div className="relative aspect-[16/10] max-h-[280px] bg-muted">
                <img src={previewImg} alt="" className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="line-clamp-2 text-lg font-semibold leading-snug drop-shadow-sm">{previewTitle}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90 drop-shadow-sm">
                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span className="line-clamp-2">{previewLocation}</span>
                  </p>
                </div>
              </div>
              <div className="space-y-3 border-t border-border/80 bg-card p-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent/40 px-2.5 py-1 text-xs font-medium">
                    <TypeIcon className="h-3.5 w-3.5 text-primary" aria-hidden />
                    {PROPERTY_TYPE_LABELS[typeKey]}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent/40 px-2.5 py-1 text-xs font-medium">
                    <Maximize2 className="h-3.5 w-3.5 text-primary" aria-hidden />
                    {typeof watched.areaM2 === "number" && Number.isFinite(watched.areaM2) ? `${watched.areaM2} m²` : "—"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent/40 px-2.5 py-1 text-xs font-medium">
                    <Bed className="h-3.5 w-3.5 text-primary" aria-hidden />
                    {num(watched.bedrooms)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent/40 px-2.5 py-1 text-xs font-medium">
                    <Bath className="h-3.5 w-3.5 text-primary" aria-hidden />
                    {num(watched.bathrooms)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent/40 px-2.5 py-1 text-xs font-medium">
                    <CarFront className="h-3.5 w-3.5 text-primary" aria-hidden />
                    {num(watched.parking)}
                  </span>
                </div>
                <div className="grid gap-2 rounded-xl border border-border/60 bg-accent/20 p-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted">Sale</span>
                    <span className="font-semibold text-foreground">{money(parseOptionalMoney(watched.priceSale))}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted">Rent / mo</span>
                    <span className="font-semibold text-foreground">{money(parseOptionalMoney(watched.priceRent))}</span>
                  </div>
                  <div className="flex justify-between gap-2 border-t border-border/50 pt-2">
                    <span className="text-muted">IPTU / yr</span>
                    <span className="font-medium text-foreground">{money(parseOptionalMoney(watched.iptuAnnual))}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-border/80 p-4 shadow-sm">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-base">Quick actions</CardTitle>
                <CardDescription>Same as the footer — handy on tall forms.</CardDescription>
              </CardHeader>
              <div className="flex flex-col gap-2">
                <Button type="submit" form="property-form" className="w-full shadow-sm">
                  {isCreate ? "Create property" : "Save changes"}
                </Button>
                <Link to="/properties" className="block">
                  <Button type="button" variant="secondary" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
