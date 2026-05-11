export const LEAD_SOURCES = [
  "website",
  "landing_page",
  "phone_inbound",
  "walk_in",
  "referral",
  "social_organic",
  "social_paid",
  "olx",
  "viva_real",
  "zap_imoveis",
  "other_portal",
  "whatsapp",
  "email",
  "event",
  "partner",
  "manual",
  "unknown",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website: "Website",
  landing_page: "Landing page",
  phone_inbound: "Inbound call",
  walk_in: "Walk-in",
  referral: "Referral",
  social_organic: "Social (organic)",
  social_paid: "Social (paid)",
  olx: "OLX",
  viva_real: "Viva Real",
  zap_imoveis: "Zap Imóveis",
  other_portal: "Other portal",
  whatsapp: "WhatsApp",
  email: "Email",
  event: "Event",
  partner: "Partner",
  manual: "Manual",
  unknown: "Unknown",
};

export type LeadStatus = "new" | "qualified" | "proposal" | "won" | "lost";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  qualified: "Qualified",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

export type ActivityType = "call" | "visit" | "note" | "task" | "reminder";

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  body?: string;
  at: string;
  byUserId: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  source: LeadSource;
  sourceNote?: string;
  status: LeadStatus;
  assigneeId: string;
  tags: string[];
  consentMarketing: boolean;
  consentWhatsApp: boolean;
  createdAt: string;
  activities: Activity[];
};

export type DealStage =
  | "discovery"
  | "proposal"
  | "negotiation"
  | "contract"
  | "closed_won"
  | "closed_lost";

export type Deal = {
  id: string;
  title: string;
  leadId: string;
  propertyId: string | null;
  value: number;
  currency: "BRL";
  expectedClose: string;
  stage: DealStage;
  stageHistory: { stage: DealStage; at: string }[];
};
