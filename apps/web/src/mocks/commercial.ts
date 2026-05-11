export type SaleDeal = {
  id: string;
  title: string;
  stage: "proposal" | "negotiation" | "contract" | "closing";
  client: string;
  property: string;
  value: number;
};

export type RentalDeal = {
  id: string;
  title: string;
  stage: "listing" | "visit" | "application" | "lease" | "move_in" | "renewal";
  client: string;
  property: string;
  monthly: number;
};

export const mockSaleDeals: SaleDeal[] = [
  {
    id: "sd_1",
    title: "Sale — Paulista",
    stage: "negotiation",
    client: "Horizonte Developments",
    property: "Paulista penthouse",
    value: 3_250_000,
  },
  {
    id: "sd_2",
    title: "Sale — Jardins",
    stage: "proposal",
    client: "Mariana Costa",
    property: "Jardins apartment",
    value: 1_980_000,
  },
];

export const mockRentalDeals: RentalDeal[] = [
  {
    id: "rd_1",
    title: "Rent — Copacabana",
    stage: "visit",
    client: "Ricardo Almeida",
    property: "2-bed apartment",
    monthly: 4200,
  },
];

export type CalendarEvent = {
  id: string;
  title: string;
  at: string;
  type: "visit" | "contract" | "renewal";
};

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "ce_1",
    title: "Showing — Paulista penthouse",
    at: "2026-05-12T15:00:00Z",
    type: "visit",
  },
  {
    id: "ce_2",
    title: "Signing — Copacabana lease",
    at: "2026-05-14T11:00:00Z",
    type: "contract",
  },
  {
    id: "ce_3",
    title: "Site visit — Jardins resale",
    at: "2026-05-05T10:30:00Z",
    type: "visit",
  },
  {
    id: "ce_4",
    title: "Renewal review — Itaim office",
    at: "2026-05-21T09:00:00Z",
    type: "renewal",
  },
  {
    id: "ce_5",
    title: "Open house — Moema",
    at: "2026-05-18T14:00:00Z",
    type: "visit",
  },
  {
    id: "ce_6",
    title: "Contract handoff — Pinheiros",
    at: "2026-05-18T16:30:00Z",
    type: "contract",
  },
  {
    id: "ce_7",
    title: "Keys handover",
    at: "2026-05-28T13:00:00Z",
    type: "visit",
  },
];
