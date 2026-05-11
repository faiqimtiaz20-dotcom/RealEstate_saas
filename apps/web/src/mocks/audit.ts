export type AuditEvent = {
  id: string;
  at: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: string;
};

export const mockAudit: AuditEvent[] = [
  {
    id: "aud_1",
    at: "2026-05-10T12:01:00Z",
    actorId: "usr_1",
    action: "listing.publish",
    entity: "property",
    entityId: "prop_1",
    metadata: "channel=olx",
  },
  {
    id: "aud_2",
    at: "2026-05-10T09:44:00Z",
    actorId: "usr_2",
    action: "finance.transaction.update",
    entity: "transaction",
    entityId: "txn_2",
  },
  {
    id: "aud_3",
    at: "2026-05-09T18:22:00Z",
    actorId: "usr_1",
    action: "integration.token.rotate",
    entity: "integration",
    entityId: "viva_real",
  },
];
