import type { DealStage } from "@/types/crm";

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  discovery: "Discovery",
  proposal: "Proposal",
  negotiation: "Negotiation",
  contract: "Contract",
  closed_won: "Won",
  closed_lost: "Lost",
};
