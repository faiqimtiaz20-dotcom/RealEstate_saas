export type PropertyRecord = {
  id: string;
  title: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  type: "apartment" | "house" | "commercial" | "land";
  areaM2: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  priceSale: number | null;
  priceRent: number | null;
  status: "draft" | "published";
  coverImage: string;
  gallery: string[];
  documents: { id: string; name: string; visibility: "internal" | "broker" }[];
  history: { at: string; field: string; from: string; to: string }[];
  iptuAnnual?: number | null;
};

export const mockProperties: PropertyRecord[] = [
  {
    id: "prop_1",
    title: "Penthouse open view — Paulista",
    slug: "penthouse-open-view-paulista",
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    type: "apartment",
    areaM2: 210,
    bedrooms: 3,
    bathrooms: 4,
    parking: 3,
    priceSale: 3_250_000,
    priceRent: null,
    status: "published",
    coverImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    ],
    documents: [
      { id: "doc_1", name: "Title deed (summary).pdf", visibility: "broker" },
      { id: "doc_2", name: "HOA fees — table.pdf", visibility: "internal" },
    ],
    history: [
      {
        at: "2026-05-06T18:00:00Z",
        field: "priceSale",
        from: "3200000",
        to: "3250000",
      },
    ],
    iptuAnnual: 9200,
  },
  {
    id: "prop_2",
    title: "2-bed apartment — Copacabana",
    slug: "2-bed-apartment-copacabana",
    address: "Rua Barata Ribeiro, 300",
    city: "Rio de Janeiro",
    state: "RJ",
    type: "apartment",
    areaM2: 78,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    priceSale: null,
    priceRent: 4200,
    status: "draft",
    coverImage: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"],
    documents: [],
    history: [],
  },
];
