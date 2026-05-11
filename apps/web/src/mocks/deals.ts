import type { Deal } from "@/types/crm";

export const mockDeals: Deal[] = [
  {
    id: "deal_1",
    title: "Sale — Paulista Ave",
    leadId: "led_3",
    propertyId: "prop_1",
    value: 1850000,
    currency: "BRL",
    expectedClose: "2026-06-15",
    stage: "negotiation",
    stageHistory: [
      { stage: "discovery", at: "2026-05-02T10:00:00Z" },
      { stage: "proposal", at: "2026-05-05T10:00:00Z" },
      { stage: "negotiation", at: "2026-05-09T10:00:00Z" },
    ],
  },
  {
    id: "deal_2",
    title: "Rent — Copacabana",
    leadId: "led_2",
    propertyId: "prop_2",
    value: 4200,
    currency: "BRL",
    expectedClose: "2026-05-20",
    stage: "proposal",
    stageHistory: [
      { stage: "discovery", at: "2026-05-09T12:00:00Z" },
      { stage: "proposal", at: "2026-05-10T12:00:00Z" },
    ],
  },
];
