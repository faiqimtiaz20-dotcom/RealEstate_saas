import { newId } from "@/lib/newId";
import { slugify } from "@/lib/slugify";
import type { Contact } from "@/mocks/contacts";
import { mockContacts } from "@/mocks/contacts";
import type { Account, Transaction } from "@/mocks/finance";
import { mockAccounts, mockTransactions } from "@/mocks/finance";
import { mockLeads } from "@/mocks/leads";
import type { PropertyRecord } from "@/mocks/properties";
import { mockProperties } from "@/mocks/properties";
import type { Activity, ActivityType, Lead, LeadSource, LeadStatus } from "@/types/crm";
import { create } from "zustand";

export type LeadActivityInput = {
  type: ActivityType;
  title: string;
  body?: string;
  byUserId: string;
};

export type NewLeadInput = {
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  sourceNote?: string;
  consentMarketing: boolean;
  consentWhatsApp: boolean;
};

export type NewPropertyInput = {
  title: string;
  address: string;
  city: string;
  state: string;
  type: PropertyRecord["type"];
  areaM2: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  priceSale: number | null;
  priceRent: number | null;
  status: PropertyRecord["status"];
  coverImage: string;
  galleryLines: string;
  iptuAnnual: number | null;
};

export type NewContactInput = {
  name: string;
  email?: string;
  phone: string;
  tags: string;
};

export type NewTransactionInput = {
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  categoryId: string;
  linkedDealId?: string;
};

function extraLeads(): Lead[] {
  const sources: LeadSource[] = ["website", "referral", "manual", "zap_imoveis", "viva_real"];
  const statuses: LeadStatus[] = ["new", "qualified", "proposal", "lost", "won"];
  return Array.from({ length: 14 }, (_, i) => {
    const idx = i + 4;
    return {
      id: `led_seed_${idx}`,
      name: `Demo lead ${idx}`,
      email: `lead${idx}@demo.local`,
      phone: `+55 11 90000-${String(1000 + idx).slice(-4)}`,
      source: sources[i % sources.length]!,
      status: statuses[i % statuses.length]!,
      assigneeId: i % 2 === 0 ? "usr_1" : "usr_2",
      tags: ["demo"],
      consentMarketing: true,
      consentWhatsApp: true,
      createdAt: new Date(Date.UTC(2026, 4, 1 + (i % 10))).toISOString(),
      activities: [
        {
          id: `act_seed_${idx}`,
          type: "note" as const,
          title: "Lead generated for UI",
          body: "Fictional data for pagination and filters.",
          at: new Date(Date.UTC(2026, 4, 2 + (i % 8))).toISOString(),
          byUserId: "usr_system",
        },
      ],
    } satisfies Lead;
  });
}

function extraContacts(): Contact[] {
  return Array.from({ length: 11 }, (_, i) => ({
    id: `con_seed_${i + 3}`,
    name: `Demo contact ${i + 3}`,
    email: `contato${i + 3}@demo.local`,
    phone: `+55 21 97000-${String(2000 + i).slice(-4)}`,
    tags: ["demo", i % 2 === 0 ? "lead" : "client"],
  }));
}

function seed() {
  return {
    properties: structuredClone(mockProperties) as PropertyRecord[],
    leads: [...structuredClone(mockLeads), ...extraLeads()],
    contacts: [...structuredClone(mockContacts), ...extraContacts()],
    transactions: structuredClone(mockTransactions) as Transaction[],
    accounts: structuredClone(mockAccounts) as Account[],
  };
}

type MockAppState = ReturnType<typeof seed> & {
  addProperty: (input: NewPropertyInput) => string;
  updateProperty: (id: string, input: NewPropertyInput) => void;
  addLead: (input: NewLeadInput) => string;
  updateLead: (id: string, patch: Partial<Pick<Lead, "status" | "assigneeId" | "tags">>) => void;
  addLeadActivity: (leadId: string, input: LeadActivityInput) => void;
  addContact: (input: NewContactInput) => string;
  updateContact: (id: string, patch: Partial<Contact>) => void;
  addTransaction: (input: NewTransactionInput) => string;
  addAccount: (input: Pick<Account, "code" | "name" | "bucket">) => string;
  setTransactionReconciled: (id: string, reconciled: boolean) => void;
  resetMockData: () => void;
};

export const useMockAppStore = create<MockAppState>((set) => ({
  ...seed(),
  addProperty: (input) => {
    const id = newId("prop");
    const slug = slugify(input.title) || id;
    const gallery = input.galleryLines
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const cover = input.coverImage || gallery[0] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80";
    const next: PropertyRecord = {
      id,
      title: input.title,
      slug,
      address: input.address,
      city: input.city,
      state: input.state,
      type: input.type,
      areaM2: input.areaM2,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      parking: input.parking,
      priceSale: input.priceSale,
      priceRent: input.priceRent,
      status: input.status,
      coverImage: cover,
      gallery: gallery.length ? gallery : [cover],
      documents: [],
      history: [],
      iptuAnnual: input.iptuAnnual,
    };
    set((s) => ({ properties: [next, ...s.properties] }));
    return id;
  },
  updateProperty: (id, input) => {
    set((s) => ({
      properties: s.properties.map((p) => {
        if (p.id !== id) return p;
        const gallery = input.galleryLines
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean);
        const cover = input.coverImage || gallery[0] || p.coverImage;
        const slug = slugify(input.title) || p.slug;
        return {
          ...p,
          title: input.title,
          slug,
          address: input.address,
          city: input.city,
          state: input.state,
          type: input.type,
          areaM2: input.areaM2,
          bedrooms: input.bedrooms,
          bathrooms: input.bathrooms,
          parking: input.parking,
          priceSale: input.priceSale,
          priceRent: input.priceRent,
          status: input.status,
          coverImage: cover,
          gallery: gallery.length ? gallery : [cover],
          iptuAnnual: input.iptuAnnual,
        };
      }),
    }));
  },
  addLead: (input) => {
    const id = newId("led");
    const lead: Lead = {
      id,
      name: input.name,
      email: input.email?.trim() ? input.email.trim() : null,
      phone: input.phone,
      source: input.source,
      sourceNote: input.sourceNote?.trim() || undefined,
      status: "new",
      assigneeId: "usr_1",
      tags: [],
      consentMarketing: input.consentMarketing,
      consentWhatsApp: input.consentWhatsApp,
      createdAt: new Date().toISOString(),
      activities: [
        {
          id: newId("act"),
          type: "note",
          title: "Lead created",
          body: `Source: ${input.source}`,
          at: new Date().toISOString(),
          byUserId: "usr_1",
        },
      ],
    };
    set((s) => ({ leads: [lead, ...s.leads] }));
    return id;
  },
  updateLead: (id, patch) => {
    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
  },
  addLeadActivity: (leadId, input) => {
    const activity: Activity = {
      id: newId("act"),
      type: input.type,
      title: input.title,
      body: input.body,
      at: new Date().toISOString(),
      byUserId: input.byUserId,
    };
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === leadId ? { ...l, activities: [activity, ...l.activities] } : l,
      ),
    }));
  },
  addContact: (input) => {
    const id = newId("con");
    const tags = input.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const contact: Contact = {
      id,
      name: input.name,
      email: input.email?.trim() ? input.email.trim() : null,
      phone: input.phone,
      tags: tags.length ? tags : ["contact"],
    };
    set((s) => ({ contacts: [contact, ...s.contacts] }));
    return id;
  },
      updateContact: (id, patch) => {
        set((s) => ({
          contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...patch, tags: patch.tags ?? c.tags } : c)),
        }));
      },
  addTransaction: (input) => {
    const id = newId("txn");
    const txn: Transaction = {
      id,
      date: input.date,
      description: input.description,
      amount: input.amount,
      type: input.type,
      categoryId: input.categoryId,
      linkedDealId: input.linkedDealId?.trim() || undefined,
      reconciled: false,
    };
    set((s) => ({ transactions: [txn, ...s.transactions] }));
    return id;
  },
      addAccount: (input) => {
        const id = newId("acc");
        const account: Account = { id, code: input.code, name: input.name, bucket: input.bucket };
        set((s) => ({ accounts: [...s.accounts, account] }));
        return id;
      },
      setTransactionReconciled: (id, reconciled) => {
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, reconciled } : t)),
        }));
      },
      resetMockData: () => {
        const next = seed();
        set((state) => ({
          ...state,
          properties: next.properties,
          leads: next.leads,
          contacts: next.contacts,
          transactions: next.transactions,
          accounts: next.accounts,
        }));
      },
}));
