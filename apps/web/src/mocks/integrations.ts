export type ChannelId = "olx" | "viva_real" | "zap_imoveis";

export type ChannelStatus = "connected" | "disconnected" | "error";

export type ListingChannelState = {
  id: ChannelId;
  label: string;
  status: ChannelStatus;
  lastSync: string | null;
  lastError: string | null;
};

export const mockChannels: ListingChannelState[] = [
  {
    id: "olx",
    label: "OLX",
    status: "connected",
    lastSync: "2026-05-10T14:22:00Z",
    lastError: null,
  },
  {
    id: "viva_real",
    label: "Viva Real",
    status: "error",
    lastSync: "2026-05-09T09:10:00Z",
    lastError: "Token expired — renew under Integrations.",
  },
  {
    id: "zap_imoveis",
    label: "Zap Imóveis",
    status: "disconnected",
    lastSync: null,
    lastError: null,
  },
];

export type MappingRow = {
  portalField: string;
  internalField: string;
  required: boolean;
  valid: boolean;
};

export const mockMappingRows: MappingRow[] = [
  { portalField: "title", internalField: "property.title", required: true, valid: true },
  { portalField: "price", internalField: "property.priceSale", required: true, valid: true },
  { portalField: "iptu", internalField: "property.iptuAnnual", required: false, valid: false },
];

export type QueueJob = {
  id: string;
  type: "publish" | "update" | "unpublish";
  channel: ChannelId;
  propertyTitle: string;
  attempts: number;
  status: "queued" | "running" | "failed" | "done";
  nextRunAt: string | null;
};

export const mockQueueJobs: QueueJob[] = [
  {
    id: "job_1",
    type: "publish",
    channel: "olx",
    propertyTitle: "Penthouse — open view Paulista",
    attempts: 1,
    status: "running",
    nextRunAt: null,
  },
  {
    id: "job_2",
    type: "update",
    channel: "zap_imoveis",
    propertyTitle: "2-bed apartment — Copacabana",
    attempts: 3,
    status: "failed",
    nextRunAt: "2026-05-10T16:00:00Z",
  },
];
