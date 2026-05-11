import type { PropertyRecord } from "@/mocks/properties";
import { z } from "zod";

export const propertyTypes = ["apartment", "house", "commercial", "land"] as const;

export const PROPERTY_TYPE_LABELS: Record<(typeof propertyTypes)[number], string> = {
  apartment: "Apartment",
  house: "House",
  commercial: "Commercial",
  land: "Land / lot",
};

export const propertyFormSchema = z.object({
  title: z.string().min(2, "Enter a title"),
  address: z.string().min(2, "Enter an address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "Invalid state code").max(2),
  type: z.enum(propertyTypes),
  areaM2: z.coerce.number().positive("Invalid area"),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  parking: z.coerce.number().int().min(0),
  priceSale: z.string().optional(),
  priceRent: z.string().optional(),
  iptuAnnual: z.string().optional(),
  status: z.enum(["draft", "published"]),
  coverImage: z.string().optional(),
  galleryLines: z.string().optional(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export function propertyToFormValues(p: PropertyRecord): PropertyFormValues {
  return {
    title: p.title,
    address: p.address,
    city: p.city,
    state: p.state,
    type: p.type,
    areaM2: p.areaM2,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    parking: p.parking,
    priceSale: p.priceSale == null ? "" : String(p.priceSale),
    priceRent: p.priceRent == null ? "" : String(p.priceRent),
    iptuAnnual: p.iptuAnnual == null ? "" : String(p.iptuAnnual),
    status: p.status,
    coverImage: p.coverImage,
    galleryLines: p.gallery.join("\n"),
  };
}

export function parseOptionalMoney(value?: string): number | null {
  const t = value?.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
